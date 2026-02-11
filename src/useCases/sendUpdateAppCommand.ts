import { RequestHandler } from "express";
import semver from "semver";
import { AppVersionPopulated } from "../models/appVersionModel";
import { InfoAppVersions, Store } from "../@types/store";
import { io, storesConnected } from "../socket";
import { SupportedApps } from "../utils/supportedApps";
import HttpException from "../utils/HttpException";
import { appVersionStatus } from "../constants/appVersion";

const tpiApps: Record<SupportedApps, keyof InfoAppVersions> = {
  console: "zodiac",
  roamer: "roamer_Client",
  tpi: "appVersion",
  reportCollector: "PosServerVersion",
};

const checkVersion = (
  store: Store,
  target: AppVersionPopulated,
  appVersion: AppVersionPopulated
) => {
  if (!store.tpiInfo) throw new HttpException(400, "Store app version not found");

  if (target.app !== appVersion.app) {
    const app = tpiApps[appVersion.app];
    const storeAppVersion = store.tpiInfo[app];

    if (semver.lt(storeAppVersion, appVersion.version))
      throw new HttpException(
        400,
        `The store must have ${appVersion.app} v${appVersion.version}.\nCurrent version is: ${storeAppVersion}`
      );
  }

  (appVersion.versionDependencies as AppVersionPopulated[]).forEach((version) =>
    checkVersion(store, target, version)
  );
};

export const sendUpdateAppCommand: RequestHandler = async (req, res, next) => {
  try {
    const { store, appVersion } = res.locals as { store: Store; appVersion: AppVersionPopulated };

    if (appVersion.status === appVersionStatus.disabled.name)
      throw new HttpException(400, "App version not found");

    storesConnected[store.storeId] = {
      ...storesConnected[store.storeId],
      status: { message: "Sending command...", type: "info", timestamp: Date.now() },
    };

    if (appVersion.app !== "reportCollector") {
      checkVersion(store, appVersion, appVersion);
    }

    io?.to("web").emit("update-connections", { stores: storesConnected });
    io?.to(store.socketId).emit("update-app", { app: appVersion.app, version: appVersion });

    return res.json({ message: "Command successfully sent" });
  } catch (err) {
    next(err);
  }
};
