import { IError } from "../../../shared/IError";

export class CompanyIdRequiredError extends Error implements IError {
  status: number;

  constructor() {
    super("Company ID is required");
    this.name = "CompanyIdRequired";
    this.status = 400;
  }
}
