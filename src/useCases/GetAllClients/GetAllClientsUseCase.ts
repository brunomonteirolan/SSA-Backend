import { Client } from "../../entities/Client";
import { IClientRepository } from "../../providers/Client/IClientRepository";

export class GetAllClientsUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async exec(): Promise<Client[]> {
    return await this.clientRepository.find();
  }
}
