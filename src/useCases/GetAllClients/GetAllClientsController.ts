import { RequestHandler } from "express";
import { GetAllClientsUseCase } from "./GetAllClientsUseCase";

export class GetAllClientsController {
  constructor(private getAllClientsUseCase: GetAllClientsUseCase) {}

  handle: RequestHandler = async (req, res, next) => {
    try {
      const clients = await this.getAllClientsUseCase.exec();
      return res.json({ clients });
    } catch (err) {
      next(err);
    }
  };
}
