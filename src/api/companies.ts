import { Router } from "express";
// Use cases
import { createCompanyController } from "../useCases/CreateCompany";
import { getAllCompaniesController } from "../useCases/GetAllCompanies";
import { getCompanyByIdController } from "../useCases/GetCompanyById";
import { updateOneCompanyController } from "../useCases/UpdateOneCompany";

const router = Router();

router.post("/", createCompanyController.handle);

router.get("/", getAllCompaniesController.handle);

router.get("/:companyId", getCompanyByIdController.handle);

router.put("/:companyId", updateOneCompanyController.handle);

export default router;
