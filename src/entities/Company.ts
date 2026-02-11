import mongoose from "mongoose";
import { Client } from "./Client";

interface CompanyConstructorArgs {
  name: Company["name"];
  deletedAt?: Company["deletedAt"];
  clients?: Company["clients"];
}

export class Company {
  public readonly _id: string;

  public name: string;
  public deletedAt?: Date | null;

  public clients?: Client[];

  constructor(props: CompanyConstructorArgs, _id?: string) {
    this._id = _id?.toString() ?? new mongoose.Types.ObjectId().toHexString();

    this.name = props.name;
    this.deletedAt = props.deletedAt ?? null;

    this.clients = [];
  }

  get updatableValues() {
    return { name: this.name, deletedAt: this.deletedAt };
  }
}
