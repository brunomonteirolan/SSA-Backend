import { IError } from "../../../shared/IError";

export class ClientNotFoundError extends Error implements IError {
  status: number;

  constructor(id?: string) {
    super(!id ? "Client not found" : `Client ${id} not found`);
    this.name = "ClientNotFound";
    this.status = 404;
  }
}
