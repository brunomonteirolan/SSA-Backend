import { clientRepository } from "../../providers/Client";
import { GetAllClientsController } from "./GetAllClientsController";
import { GetAllClientsUseCase } from "./GetAllClientsUseCase";

const getAllClientsUseCase = new GetAllClientsUseCase(clientRepository);
const getAllClientsController = new GetAllClientsController(getAllClientsUseCase);

export { getAllClientsController };
