import { Company } from "../../entities/Company";
import { IClientRepository } from "../../providers/Client/IClientRepository";
import { CompanyNotFoundError } from "../../providers/Company/errors/CompanyNotFoundError";
import { ICompanyRepository } from "../../providers/Company/ICompanyRepository";
import { Either } from "../../shared/Either";
import { GetCompanyByIdDTO } from "./GetCompanyByIdDTO";

export class GetCompanyByIdUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private clientRepository: IClientRepository
  ) {}

  async execute(id: GetCompanyByIdDTO): Promise<Either<CompanyNotFoundError, Company>> {
    return await this.companyRepository.findById(id, { populate: this.clientRepository });
  }
}
