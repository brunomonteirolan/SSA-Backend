import { RequestHandler } from "express";
import { storesConnected } from "../socket";
import HttpException from "../utils/HttpException";

export const setStore: RequestHandler = async (req, res, next) => {
  const { storeId } = req.params;

  try {
    const store = storesConnected[storeId];
    if (!store) throw new HttpException(400, `Store "${storeId}" not found`);
    res.locals.store = store;
    return next();
  } catch (err) {
    return next(err);
  }
};
