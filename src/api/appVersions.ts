import { Router } from "express";
import Joi from "joi";
import multer from "multer";
import * as util from "util";
import * as fs from "fs";
// Constants
import { appUrl } from "../constants/configConstants";
import { appVersionStatus } from "../constants/appVersion";
// Middlewares
import { validate } from "../middlewares";
import { setAppVersion } from "../middlewares/appVersionMiddlewares";
// Models
import AppVersionModel, { AppVersionDocument } from "../models/appVersionModel";
// Use cases
import { updateAppVersion } from "../useCases/updateAppVersion";
import { deleteAppVersion } from "../useCases/deleteAppVersion";
// Utils
import HttpException from "../utils/HttpException";
import * as s3 from "../utils/s3";
import { SupportedApps, supportedApps } from "../utils/supportedApps";
import { AppVersion } from "../utils/AppVersion";

const router = Router();

const uploads = multer({
  dest: "uploads",
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["application/zip", "application/x-zip-compressed"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

const unlinkFile = util.promisify(fs.unlink);

const appSchema = Joi.string().valid(...Object.keys(supportedApps));

const versionSchema = Joi.object({
  name: Joi.string().trim().required(),
  version: Joi.string().trim().required(),
  app: appSchema.required(),
  releaseDate: Joi.date().less("now"),
  versionDependencies: Joi.string().default(null),
});

const updateAppVersionSchema = Joi.object({
  name: Joi.string().trim(),
  version: Joi.string().trim(),
  app: appSchema,
  releaseDate: Joi.date().less("now"),
  versionDependencies: Joi.string().default(null),
});

const getAppVersions = Joi.object({ app: appSchema });

router.post(
  "/",
  uploads.single("appFile"),
  validate(versionSchema, "body"),
  async (req, res, next) => {
    const file = req.file;

    try {
      if (!file) throw new HttpException(400, "The app file is required");

      const value = {
        ...res.locals.body,
        versionDependencies: JSON.parse(req.body.versionDependencies || "[]"),
      };

      const appVersion = new AppVersionModel(value);

      const result = await s3.uploadFile(file, value.app);

      appVersion.s3 = { key: result.Key, mimetype: file.mimetype, originalName: file.originalname };
      appVersion.url = `${appUrl}/api/appVersions/${appVersion._id}/file`;
      await appVersion.save();

      const versions = await AppVersion.findByApp(value.app);

      return res.json({ versions });
    } catch (err: any) {
      // mongoose 8 uses MongoServerError instead of MongoError
      err.code === 11000
        ? next(new HttpException(400, "Version name already in use"))
        : next(err);
    } finally {
      if (file) {
        unlinkFile(file.path);
      }
    }
  }
);

router.get("/", validate(getAppVersions, "query"), async (req, res, next) => {
  try {
    const { app } = res.locals.query as { app?: SupportedApps };

    const versions = await (app ? AppVersion.findByApp(app) : AppVersion.find());

    return res.json({ versions });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:appVersionId/file",
  setAppVersion(),
  validate(getAppVersions, "query"),
  async (req, res, next) => {
    try {
      const { appVersion } = res.locals as { appVersion: AppVersionDocument };

      res.setHeader("Content-disposition", `attachment; filename="${appVersion.s3.originalName}"`);
      res.setHeader("Content-type", appVersion.s3.mimetype);

      s3.getFileStream(appVersion.s3.key).pipe(res);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:appVersionId",
  setAppVersion(),
  uploads.single("appFile"),
  validate(updateAppVersionSchema, "body"),
  updateAppVersion
);

router.delete("/:appVersionId", setAppVersion(), deleteAppVersion);

export default router;
