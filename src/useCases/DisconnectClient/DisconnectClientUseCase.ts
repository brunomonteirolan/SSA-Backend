import { ClientNotFoundError } from "../../providers/Client/errors/ClientNotFoundError";
import { IClientRepository } from "../../providers/Client/IClientRepository";
import { Either, left, right } from "../../shared/Either";

export class DisconnectClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async exec(storeId: string): Promise<Either<ClientNotFoundError, null>> {
    const clientResponse = await this.clientRepository.findByStoreId(storeId);
    if (clientResponse.isLeft()) return left(new ClientNotFoundError());

    clientResponse.value.disconnect();
    await this.clientRepository.updateByStoreId(storeId, clientResponse.value);

    return right(null);
  }
}
