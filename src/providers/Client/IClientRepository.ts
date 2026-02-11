import { Client } from "../../entities/Client";
import { Either } from "../../shared/Either";
import { ClientNotFoundError } from "./errors/ClientNotFoundError";

export interface UpdateOptions {
  upsert?: boolean;
}

export interface IClientRepository {
  find(): Promise<Client[]>;
  findByStoreId(storeId: string): Promise<Either<ClientNotFoundError, Client>>;
  findManyById(ids: string[]): Promise<Client[]>;
  findManyByCompany(companyId: string): Promise<Client[]>;
  save(client: Client): Promise<void>;
  updateByStoreId(storeId: string, client: Client, options?: UpdateOptions): Promise<void>;
  updateById(id: string, client: Client, options?: UpdateOptions): Promise<void>;
}
