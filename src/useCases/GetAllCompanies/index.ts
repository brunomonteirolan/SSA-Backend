import { MongooseClientRepository } from "../../providers/Client/MongooseClientRepository";
import { MongooseCompanyRepository } from "../../providers/Company/MongooseCompanyRepository";
import { GetAllCompaniesController } from "./GetAllCompaniesController";
import { GetAllCompaniesUseCase } from "./GetAllCompaniesUseCase";

const mongooseCompanyRepository = new MongooseCompanyRepository();
const mongooseClientRepository = new MongooseClientRepository();
const getAllCompaniesUseCase = new GetAllCompaniesUseCase(mongooseCompanyRepository, mongooseClientRepository);
const getAllCompaniesController = new GetAllCompaniesController(getAllCompaniesUseCase);

export { getAllCompaniesController };
