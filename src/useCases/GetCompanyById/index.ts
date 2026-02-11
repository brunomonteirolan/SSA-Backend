import { MongooseClientRepository } from "../../providers/Client/MongooseClientRepository";
import { MongooseCompanyRepository } from "../../providers/Company/MongooseCompanyRepository";
import { GetCompanyByIdController } from "./GetCompanyByIdController";
import { GetCompanyByIdUseCase } from "./GetCompanyByIdUseCase";

const mongooseCompanyRepository = new MongooseCompanyRepository();
const mongooseClientRepository = new MongooseClientRepository();
const getCompanyByIdUseCase = new GetCompanyByIdUseCase(mongooseCompanyRepository, mongooseClientRepository);
const getCompanyByIdController = new GetCompanyByIdController(getCompanyByIdUseCase);

export { getCompanyByIdController };
