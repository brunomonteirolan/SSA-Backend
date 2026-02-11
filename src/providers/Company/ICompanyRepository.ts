import { Company } from "../../entities/Company";
import { Either } from "../../shared/Either";
import { IClientRepository } from "../Client/IClientRepository";
import { CompanyNotFoundError } from "./errors/CompanyNotFoundError";

export interface FindOptions {
  populate?: IClientRepository;
}

export interface ICompanyRepository {
  save(company: Company): Promise<Company>;
  find(options?: FindOptions): Promise<Company[]>;
  findById(id: string, options?: FindOptions): Promise<Either<CompanyNotFoundError, Company>>;
  updateById(id: string, newCompany: Company): Promise<void>;
}
