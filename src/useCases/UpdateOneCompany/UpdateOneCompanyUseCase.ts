import { Client } from "../../entities/Client";
import { Company } from "../../entities/Company";
import { ClientNotFoundError } from "../../providers/Client/errors/ClientNotFoundError";
import { IClientRepository } from "../../providers/Client/IClientRepository";
import { ICompanyRepository } from "../../providers/Company/ICompanyRepository";
import { Either, left, right } from "../../shared/Either";
import { ClientsAlreadyLinkedToCompanyError } from "../CreateCompany/errors/ClientsAlreadyLinkedToCompanyError";
import { IUpdateOneCompanyDTO } from "./UpdateOneCompanyDTO";

export class UpdateOneCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private clientRepository: IClientRepository
  ) {}

  private async updateCompanyToClients(clients: Client[], company: string | null) {
    await Promise.all(
      clients.map((client) => {
        client.company = company ?? null;
        return this.clientRepository.updateById(client._id, client);
      })
    );
  }

  async execute(
    companyId: string,
    data: IUpdateOneCompanyDTO
  ): Promise<Either<ClientsAlreadyLinkedToCompanyError | ClientNotFoundError, Company>> {
    const companyResponse = await this.companyRepository.findById(companyId);
    if (companyResponse.isLeft()) throw companyResponse.value;

    const oldCompany = companyResponse.value;
    const newClients = await this.clientRepository.findManyById(data.clients ?? []);

    if (data.clients?.length && newClients.length !== data.clients?.length) {
      const newClientsId = newClients.map(({ _id }) => _id);
      for (const client of data.clients) {
        if (!newClientsId.includes(client)) return left(new ClientNotFoundError(client));
      }
    }

    const clientsLinkedToCompany = newClients.filter(
      (client) => client.company && client.company !== companyId
    );
    if (clientsLinkedToCompany.length)
      return left(new ClientsAlreadyLinkedToCompanyError(clientsLinkedToCompany));

    const oldClients = await this.clientRepository.findManyByCompany(companyId);

    await Promise.all([
      this.updateCompanyToClients(oldClients, null),
      this.updateCompanyToClients(newClients, companyId),
    ]);

    const newCompany = new Company({ ...oldCompany, name: data.name });
    await this.companyRepository.updateById(companyId, newCompany);
    newCompany.clients = newClients;

    return right(newCompany);
  }
}
