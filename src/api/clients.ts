import { Router } from "express";
import { getAllClientsController } from "../useCases/GetAllClients";

const router = Router();

router.get("/", getAllClientsController.handle);

export default router;
