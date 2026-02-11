import { RequestHandler } from "express";
import * as fs from "fs";
import * as util from "util";
import { AppVersionDocument } from "../../models/appVersionModel";
import { AppVersion } from "../../utils/AppVersion";
import * as s3 from "../../utils/s3";

const unlinkFile = util.promisify(fs.unlink);

export const updateAppVersion: RequestHandler = async (req, res, next) => {
  const file = req.file;

  try {
    const appVersion = res.locals.appVersion as AppVersionDocument;
    const body = res.locals.body;

    const updates: Partial<AppVersionDocument> = {
      ...body,
    };

    if (body.versionDependencies) {
      updates.versionDependencies = JSON.parse(body.versionDependencies || "[]");
    }

    if (file) {
      // Delete old file from S3
      if (appVersion.s3?.key) {
        await s3.deleteFile(appVersion.s3.key).catch(() => {});
      }

      // Upload new file
      const result = await s3.uploadFile(file, appVersion.app);
      (updates as any).s3 = {
        key: result.Key,
        mimetype: file.mimetype,
        originalName: file.originalname,
      };
    }

    await appVersion.updateOne(updates);
    const versions = await AppVersion.findByApp(appVersion.app);

    return res.json({ versions });
  } catch (err) {
    next(err);
  } finally {
    if (file) {
      unlinkFile(file.path).catch(() => {});
    }
  }
};
