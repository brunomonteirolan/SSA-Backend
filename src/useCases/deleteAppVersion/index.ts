import { RequestHandler } from "express";
import { AppVersionDocument } from "../../models/appVersionModel";
import { AppVersion } from "../../utils/AppVersion";
import * as s3 from "../../utils/s3";

export const deleteAppVersion: RequestHandler = async (req, res, next) => {
  try {
    const appVersion = res.locals.appVersion as AppVersionDocument;

    // Delete file from S3
    if (appVersion.s3?.key) {
      await s3.deleteFile(appVersion.s3.key).catch(() => {});
    }

    await appVersion.deleteOne();

    const versions = await AppVersion.findByApp(appVersion.app);

    return res.json({ versions, message: "App version deleted successfully" });
  } catch (err) {
    next(err);
  }
};
