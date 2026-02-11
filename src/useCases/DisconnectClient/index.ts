import { clientRepository } from "../../providers/Client";
import { DisconnectClientUseCase } from "./DisconnectClientUseCase";

const disconnectClientUseCase = new DisconnectClientUseCase(clientRepository);
export { disconnectClientUseCase };
