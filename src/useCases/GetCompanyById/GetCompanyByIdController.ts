import { RequestHandler } from "express";
import { CompanyIdRequiredError } from "./errors/CompanyIdRequiredError";
import { GetCompanyByIdUseCase } from "./GetCompanyByIdUseCase";

export class GetCompanyByIdController {
  constructor(private getCompanyByIdUseCase: GetCompanyByIdUseCase) {}

  handle: RequestHandler = async (req, res, next) => {
    try {
      const { companyId } = req.params as { companyId?: string };
      if (!companyId) throw new CompanyIdRequiredError();

      const companyResponse = await this.getCompanyByIdUseCase.execute(companyId);
      if (companyResponse.isLeft()) throw companyResponse.value;

      res.json({ company: companyResponse.value });
    } catch (err) {
      next(err);
    }
  };
}
