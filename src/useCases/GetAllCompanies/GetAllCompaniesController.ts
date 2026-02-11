import { RequestHandler } from "express";
import { GetAllCompaniesUseCase } from "./GetAllCompaniesUseCase";

export class GetAllCompaniesController {
  constructor(private getAllCompaniesUseCase: GetAllCompaniesUseCase) {}

  handle: RequestHandler = async (req, res, next) => {
    try {
      const companies = await this.getAllCompaniesUseCase.execute();
      res.json({ companies });
    } catch (err) {
      next(err);
    }
  };
}
