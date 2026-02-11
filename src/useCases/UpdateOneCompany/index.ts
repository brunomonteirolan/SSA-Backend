import { MongooseClientRepository } from "../../providers/Client/MongooseClientRepository";
import { MongooseCompanyRepository } from "../../providers/Company/MongooseCompanyRepository";
import { UpdateOneCompanyController } from "./UpdateOneCompanyController";
import { UpdateOneCompanyUseCase } from "./UpdateOneCompanyUseCase";

const mongooseCompanyRepository = new MongooseCompanyRepository();
const mongooseClientRepository = new MongooseClientRepository();
const updateOneCompanyUseCase = new UpdateOneCompanyUseCase(mongooseCompanyRepository, mongooseClientRepository);
const updateOneCompanyController = new UpdateOneCompanyController(updateOneCompanyUseCase);

export { updateOneCompanyController };
