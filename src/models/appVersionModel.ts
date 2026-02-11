import { Schema, model, models, HydratedDocument, Model, Types } from "mongoose";
import { appVersionStatus, AppVersionStatus } from "../constants/appVersion";
import { SupportedApps, supportedApps } from "../utils/supportedApps";

// Plain interface for mongoose schema
interface IAppVersion {
  version: string;
  name: string;
  app: SupportedApps;
  s3: { key: string; mimetype: string; originalName: string };
  url: string;
  releaseDate: Date;
  versionDependencies: Types.ObjectId[];
  status: AppVersionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AppVersionPopulated extends Omit<IAppVersion, "versionDependencies"> {
  _id: Types.ObjectId;
  versionDependencies: AppVersionPopulated[];
}

export type AppVersionDocument = HydratedDocument<IAppVersion>;

// Re-export AppVersion as alias for backwards compatibility
export type AppVersion = IAppVersion;

const AppVersionSchema = new Schema<IAppVersion>(
  {
    version: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    app: { type: String, required: true, enum: Object.keys(supportedApps) },
    s3: {
      key: { type: String, required: true, select: false },
      mimetype: { type: String, required: true },
      originalName: { type: String, required: true },
    },
    url: { type: String, required: true },
    releaseDate: { type: Date, default: Date.now },
    versionDependencies: {
      type: [{ type: Schema.Types.ObjectId, ref: "AppVersion" }],
      default: [],
    },
    status: {
      type: String,
      enum: Object.keys(appVersionStatus),
      default: appVersionStatus.active.name,
      required: true,
    },
  },
  { timestamps: true }
);

const AppVersionModel = (models.AppVersion || model<IAppVersion>("AppVersion", AppVersionSchema, "appsVersions")) as Model<IAppVersion>;

export default AppVersionModel;
