import { Company } from "../../entities/Company";
import { CompanyModel } from "../../models/companyModel";
import { Either, left, right } from "../../shared/Either";
import { CompanyNotFoundError } from "./errors/CompanyNotFoundError";
import { FindOptions, ICompanyRepository } from "./ICompanyRepository";

export class MongooseCompanyRepository implements ICompanyRepository {
  async findById(id: string, options?: FindOptions): Promise<Either<CompanyNotFoundError, Company>> {
    const mongooseCompany = await CompanyModel.findById(id);
    if (!mongooseCompany) return left(new CompanyNotFoundError());

    const company = new Company(mongooseCompany, (mongooseCompany._id as any).toString());

    if (options?.populate) {
      company.clients = await options.populate.findManyByCompany(company._id);
    }

    return right(company);
  }

  async find(options?: FindOptions): Promise<Company[]> {
    const mongooseCompanies = await CompanyModel.find();
    const companies = mongooseCompanies.map(
      (company) => new Company(company, (company._id as any).toString())
    );

    if (options?.populate) {
      for (const company of companies) {
        company.clients = await options.populate.findManyByCompany(company._id);
      }
    }

    return companies;
  }

  async save(company: Company): Promise<Company> {
    const newCompany = await CompanyModel.create(company);
    return new Company(
      { name: newCompany.name, deletedAt: null },
      (newCompany._id as any).toString()
    );
  }

  async updateById(_id: string, company: Company): Promise<void> {
    await CompanyModel.updateOne({ _id }, company.updatableValues);
  }
}
