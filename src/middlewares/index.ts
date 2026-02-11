import { NextFunction, Request, Response, RequestHandler } from "express";
import Joi from "joi";

import { dev } from "../constants/configConstants";
import HttpException from "../utils/HttpException";

type ErrorHandler = (err: HttpException, req: Request, res: Response, next: NextFunction) => void;
type Validate = (schema: Joi.ObjectSchema, property: "body" | "query") => RequestHandler;

export const notFound: RequestHandler = (req, res, next) =>
  next(new HttpException(404, `Not found - ${req.originalUrl}`));

export const errorHandler: ErrorHandler = (err, req, res, _next) => {
  res.status(err.status || 500).send({
    message: err.message || "Something went wrong",
    stack: dev ? err.stack : undefined,
  });
};

export const validate: Validate = (schema, property) => async (req, res, next) => {
  try {
    res.locals[property] = await schema.validateAsync(req[property]);
    next();
  } catch (err) {
    next(err);
  }
};
