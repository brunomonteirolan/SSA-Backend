import { Client } from "../../../entities/Client";
import { IError } from "../../../shared/IError";

export class ClientsAlreadyLinkedToCompanyError extends Error implements IError {
  status: number;

  constructor(clients: Client[]) {
    const clientsId = clients.map(({ _id }) => _id).join(", ");
    super(`The clients ${clientsId} are already linked to a company`);
    this.status = 400;
  }
}
