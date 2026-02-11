import { RequestHandler } from "express";
import * as yup from "yup";
import { CreateCompanyUseCase } from "./CreateCompanyUseCase";

const createCompanySchema = yup.object({
  name: yup.string().trim().required(),
  clients: yup.array().of(yup.string().required()),
});

export class CreateCompanyController {
  constructor(private createCompanyUseCase: CreateCompanyUseCase) {}

  handle: RequestHandler = async (req, res, next) => {
    try {
      const values = await createCompanySchema.validate(req.body);
      const companyResponse = await this.createCompanyUseCase.execute(values);
      if (companyResponse.isLeft()) throw companyResponse.value;
      res.status(201).json({ company: companyResponse.value });
    } catch (err) {
      next(err);
    }
  };
}
