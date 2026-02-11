import mongoose from "mongoose";
import { Company } from "./Company";

type ClientTypes = "Server";

interface ClientConstructorArgs {
  storeId: string;
  company?: Company | string | null;
  type?: ClientTypes;
  lastSocketId?: string;
  connected: Client["connected"];
}

export class Client {
  public readonly _id: string;

  public storeId: string;
  public company?: Company | string | null;
  public type: ClientTypes;
  public lastSocketId?: string;
  public connected: boolean;

  constructor(props: ClientConstructorArgs, _id?: string) {
    this._id = _id?.toString() ?? new mongoose.Types.ObjectId().toHexString();

    this.storeId = props.storeId;
    this.company = props.company?.toString();
    this.type = props.type ?? "Server";
    this.lastSocketId = props.lastSocketId;
    this.connected = props.connected;
  }

  get updatableValues() {
    return {
      storeId: this.storeId,
      company: this.company,
      type: this.type,
      lastSocketId: this.lastSocketId,
      connected: this.connected,
    };
  }

  connect(socketId: string) {
    this.connected = true;
    this.lastSocketId = socketId;
  }

  disconnect() {
    this.connected = false;
  }
}
