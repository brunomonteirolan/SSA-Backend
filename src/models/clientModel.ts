import { Schema, model, models, HydratedDocument, Model, Types } from "mongoose";

// Plain interface for mongoose schema (separate from Client entity class)
interface IClient {
  storeId: string;
  type: "Server";
  lastSocketId?: string;
  company?: Types.ObjectId;
  connected: boolean;
}

export type ClientDocument = HydratedDocument<IClient>;

const ClientSchema = new Schema<IClient>({
  storeId: { type: String, required: true },
  type: { type: String, enum: ["Server"], default: "Server", required: true },
  lastSocketId: { type: String },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  connected: { type: Boolean, required: true, default: false },
});

const ClientModel = (models.Client || model<IClient>("Client", ClientSchema, "clients")) as Model<IClient>;

export default ClientModel;
