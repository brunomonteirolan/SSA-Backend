import { Schema, model, models, HydratedDocument, Model } from "mongoose";

// Plain interface for mongoose schema (separate from Company entity class)
interface ICompany {
  name: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CompanyDocument = HydratedDocument<ICompany>;

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const CompanyModel = (models.Company || model<ICompany>("Company", CompanySchema, "companies")) as Model<ICompany>;
