import { MongooseClientRepository } from "../../providers/Client/MongooseClientRepository";
import { MongooseCompanyRepository } from "../../providers/Company/MongooseCompanyRepository";
import { CreateCompanyController } from "./CreateCompanyController";
import { CreateCompanyUseCase } from "./CreateCompanyUseCase";

const mongooseCompanyRepository = new MongooseCompanyRepository();
const mongooseClientRepository = new MongooseClientRepository();
const createCompanyUseCase = new CreateCompanyUseCase(mongooseCompanyRepository, mongooseClientRepository);
const createCompanyController = new CreateCompanyController(createCompanyUseCase);

export { createCompanyController };
