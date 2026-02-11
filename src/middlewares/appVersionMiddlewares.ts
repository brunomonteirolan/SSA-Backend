import { RequestHandler } from "express";
import { appVersionStatus } from "../constants/appVersion";
import AppVersionModel from "../models/appVersionModel";
import HttpException from "../utils/HttpException";

export const setAppVersion =
  ({ disabled = false } = {}): RequestHandler =>
  async (req, res, next) => {
    const { appVersionId } = req.params;

    try {
      const appVersion = await AppVersionModel.findById(appVersionId)
        .populate({
          path: "versionDependencies",
          model: "AppVersion",
          populate: {
            path: "versionDependencies",
            model: "AppVersion",
          },
        })
        .select(["+s3.key"]);

      if (!appVersion || (!disabled && appVersion.status === appVersionStatus.disabled.name))
        throw new HttpException(404, "App version not found");

      res.locals.appVersion = appVersion;
      return next();
    } catch (err) {
      return next(err);
    }
  };
