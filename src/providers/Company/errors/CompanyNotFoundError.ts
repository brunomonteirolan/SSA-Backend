import { IError } from "../../../shared/IError";

export class CompanyNotFoundError extends Error implements IError {
  status: number;

  constructor(id?: string) {
    super(!id ? "Company not found" : `Company ${id} not found`);
    this.name = "CompanyNotFound";
    this.status = 404;
  }
}
