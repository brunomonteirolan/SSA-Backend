import { Router } from "express";
// Middlewares
import { setAppVersion } from "../middlewares/appVersionMiddlewares";
import { setStore } from "../middlewares/storeMiddlewares";
// Use cases
import { sendUpdateAppCommand } from "../useCases/sendUpdateAppCommand";

const router = Router();

router.post("/:storeId/update-app/:appVersionId", setStore, setAppVersion, sendUpdateAppCommand);

export default router;
