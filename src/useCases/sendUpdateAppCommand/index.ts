import { RequestHandler } from "express";
import { io } from "../../socket";
import { Store } from "../../@types/store";
import { AppVersionDocument } from "../../models/appVersionModel";

export const sendUpdateAppCommand: RequestHandler = async (req, res, next) => {
  try {
    const { store, appVersion } = res.locals as {
      store: Store;
      appVersion: AppVersionDocument;
    };

    io?.to(store.socketId).emit("update-app", {
      app: appVersion.app,
      url: appVersion.url,
      version: appVersion.version,
      name: appVersion.name,
      versionDependencies: appVersion.versionDependencies,
    });

    return res.json({ message: "Update command sent successfully" });
  } catch (err) {
    next(err);
  }
};
