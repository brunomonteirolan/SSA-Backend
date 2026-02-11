import { IClientRepository } from "../../providers/Client/IClientRepository";
import { ICompanyRepository } from "../../providers/Company/ICompanyRepository";

export class GetAllCompaniesUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private clientRepository: IClientRepository
  ) {}

  async execute() {
    return await this.companyRepository.find({ populate: this.clientRepository });
  }
}
