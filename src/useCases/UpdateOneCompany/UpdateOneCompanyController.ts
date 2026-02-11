import * as yup from "yup";
import { RequestHandler } from "express";
import { UpdateOneCompanyUseCase } from "./UpdateOneCompanyUseCase";

const updateCompanySchema = yup.object({
  name: yup.string().trim().required(),
  clients: yup.array().of(yup.string().required()),
});

export class UpdateOneCompanyController {
  constructor(private updateOneCompanyUseCase: UpdateOneCompanyUseCase) {}

  handle: RequestHandler = async (req, res, next) => {
    try {
      const values = await updateCompanySchema.validate(req.body);
      const { companyId } = req.params as { companyId: string };
      const updateCompanyResponse = await this.updateOneCompanyUseCase.execute(companyId, values);
      if (updateCompanyResponse.isLeft()) throw updateCompanyResponse.value;
      return res.json({ company: updateCompanyResponse.value });
    } catch (err) {
      next(err);
    }
  };
}
