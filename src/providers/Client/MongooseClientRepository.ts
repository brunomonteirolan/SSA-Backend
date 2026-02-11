import { Client } from "../../entities/Client";
import ClientModel, { ClientDocument } from "../../models/clientModel";
import { Either, left, right } from "../../shared/Either";
import { ClientNotFoundError } from "./errors/ClientNotFoundError";
import { IClientRepository, UpdateOptions } from "./IClientRepository";
import { Types } from "mongoose"; 

export class MongooseClientRepository implements IClientRepository {
  private documentToEntity(client: ClientDocument): Client {
  const props: any = client.toObject();

  // Converte company (ObjectId / populado / string) para o tipo aceito pelo ClientConstructorArgs
  const company = props.company;

  if (company instanceof Types.ObjectId) {
    props.company = company.toString();
  } else if (company && typeof company === "object" && company._id instanceof Types.ObjectId) {
    // caso esteja populado, pega o _id
    props.company = company._id.toString();
  } // se já for string / null / undefined, mantém

  return new Client(props, client._id.toString());
  }

  private documentArrayToEntityArray(clients: ClientDocument[]): Client[] {
    return clients.map((c) => this.documentToEntity(c));
  }

  async find(): Promise<Client[]> {
    const clients = await ClientModel.find().sort("storeId");
    return this.documentArrayToEntityArray(clients);
  }

  async findByStoreId(storeId: string): Promise<Either<ClientNotFoundError, Client>> {
    const client = await ClientModel.findOne({ storeId });
    if (!client) return left(new ClientNotFoundError());
    return right(this.documentToEntity(client));
  }

  async findManyById(ids: string[]): Promise<Client[]> {
    const clients = await ClientModel.find({ _id: { $in: ids } });
    return this.documentArrayToEntityArray(clients);
  }

  async findManyByCompany(companyId: string): Promise<Client[]> {
    const clients = await ClientModel.find({ company: companyId });
    return this.documentArrayToEntityArray(clients);
  }

  async save(client: Client): Promise<void> {
    await ClientModel.create(client);
  }

  async updateByStoreId(storeId: string, client: Client, options?: UpdateOptions): Promise<void> {
    await ClientModel.updateOne({ storeId }, client.updatableValues, options);
  }

  async updateById(_id: string, client: Client, options?: UpdateOptions): Promise<void> {
    await ClientModel.updateOne({ _id }, client.updatableValues, options);
  }
}
