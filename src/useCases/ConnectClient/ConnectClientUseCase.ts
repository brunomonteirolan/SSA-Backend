import { Client } from "../../entities/Client";
import { IClientRepository } from "../../providers/Client/IClientRepository";
import { IConnectClientDTO } from "./ConnectClientDTO";

export class ConnectClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async exec({ storeId, socketId }: IConnectClientDTO): Promise<Client> {
    const clientResponse = await this.clientRepository.findByStoreId(storeId);

    if (clientResponse.isLeft()) {
      const client = new Client({ storeId, lastSocketId: socketId, connected: true });
      this.clientRepository.save(client);
      return client;
    }

    clientResponse.value.connect(socketId);
    this.clientRepository.updateByStoreId(storeId, clientResponse.value);
    return clientResponse.value;
  }
}
