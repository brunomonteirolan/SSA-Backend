import { RequestHandler } from "express";
import * as util from "util";
import * as fs from "fs";
import { AppVersionDocument } from "../models/appVersionModel";
import * as s3 from "../utils/s3";
import { AppVersion } from "../utils/AppVersion";

const unlinkFile = util.promisify(fs.unlink);

export const updateAppVersion: RequestHandler = async (req, res, next) => {
  const file = req.file;

  try {
    const { appVersion } = res.locals as { appVersion: AppVersionDocument };
    const values: Record<string, unknown> = {
      ...res.locals.body,
      versionDependencies: JSON.parse(req.body.versionDependencies || "[]"),
    };

    if (file) {
      await s3.uploadFile(file, appVersion.app, { key: appVersion.s3.key });
      values.s3 = {
        key: appVersion.s3.key,
        mimetype: file.mimetype,
        originalName: file.originalname,
      };
    }

    await appVersion.updateOne(values);
    const versions = await AppVersion.findByApp(appVersion.app);
    return res.json({ versions, message: "App version successfully updated" });
  } catch (err) {
    next(err);
  } finally {
    if (file) {
      unlinkFile(file.path).catch(() => {});
    }
  }
};
