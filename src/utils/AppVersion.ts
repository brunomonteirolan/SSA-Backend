import { FilterQuery } from "mongoose";
// Constants
import { appVersionStatus } from "../constants/appVersion";
// Models
import AppVersionModel, { AppVersionDocument } from "../models/appVersionModel";
// Utils
import { SupportedApps } from "./supportedApps";

interface FindOptions {
  disabled?: boolean;
}

export class AppVersion {
  private static applyQueryOptions(
    filter: FilterQuery<AppVersionDocument>,
    options?: FindOptions
  ): FilterQuery<AppVersionDocument> {
    if (!options?.disabled) {
      filter["$or"] = [
        { status: appVersionStatus.active.name },
        { status: { $exists: false } },
      ];
    }
    return filter;
  }

  // Find many
  static async find(options?: FindOptions): Promise<AppVersionDocument[]> {
    const filter = this.applyQueryOptions({}, options);
    return await AppVersionModel.find(filter)
      .populate("versionDependencies")
      .sort({ releaseDate: -1 })
      .exec();
  }

  // Find many by app
  static async findByApp(app: SupportedApps, options?: FindOptions): Promise<AppVersionDocument[]> {
    const filter = this.applyQueryOptions({ app }, options);
    return await AppVersionModel.find(filter)
      .populate("versionDependencies")
      .sort({ releaseDate: -1 })
      .exec();
  }
}
