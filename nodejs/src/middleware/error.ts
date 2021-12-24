import logger from "winston";
import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
  err: any,
  request: Request,
  response: Response,
  next?: NextFunction
) => {
  logger.error(err);
  response.status(err.httpStatusCode || 500).json({
    code: err.code || "unknown",
    message: err.message || "",
    details: err.details || {},
  });
  return response.end();
};

export default errorMiddleware;
