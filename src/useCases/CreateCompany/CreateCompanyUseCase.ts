import { Client } from "../../entities/Client";
import { Company } from "../../entities/Company";
import { IClientRepository } from "../../providers/Client/IClientRepository";
import { ICompanyRepository } from "../../providers/Company/ICompanyRepository";
import { ICreateCompanyDTO } from "./CreateCompanyDTO";
import { ClientsAlreadyLinkedToCompanyError } from "./errors/ClientsAlreadyLinkedToCompanyError";
import { Either, left, right } from "../../shared/Either";

export class CreateCompanyUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private clientRepository: IClientRepository
  ) {}

  async execute(data: ICreateCompanyDTO): Promise<Either<ClientsAlreadyLinkedToCompanyError, Company>> {
    const company = new Company({ name: data.name });
    let clients: Client[] = [];

    if (data.clients?.length) {
      clients = await this.clientRepository.findManyById(data.clients);
      const clientsLinkedToCompany = clients.filter((client) => client.company);
      if (clientsLinkedToCompany.length)
        return left(new ClientsAlreadyLinkedToCompanyError(clientsLinkedToCompany));
    }

    const newCompany = await this.companyRepository.save(company);

    await Promise.all(
      clients.map((client) => {
        client.company = newCompany._id;
        newCompany.clients?.push(client);
        return this.clientRepository.updateById(client._id, client);
      })
    );

    return right(newCompany);
  }
}
