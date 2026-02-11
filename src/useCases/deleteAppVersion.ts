import { RequestHandler } from "express";
import { appVersionStatus } from "../constants/appVersion";
import AppVersionModel, { AppVersionDocument } from "../models/appVersionModel";
import { AppVersion } from "../utils/AppVersion";
import HttpException from "../utils/HttpException";

export const deleteAppVersion: RequestHandler = async (req, res, next) => {
  try {
    const { appVersion } = res.locals as { appVersion: AppVersionDocument };

    const dependentApps = await AppVersionModel.find({
      versionDependencies: appVersion._id,
      $or: [{ status: appVersionStatus.active.name }, { status: { $exists: false } }],
    });

    if (dependentApps.length)
      throw new HttpException(400, "There are apps that depend on this version");

    appVersion.status = appVersionStatus.disabled.name;
    await appVersion.save();

    const versions = await AppVersion.findByApp(appVersion.app);
    return res.json({ versions, message: "App version successfully deleted" });
  } catch (err) {
    next(err);
  }
};
