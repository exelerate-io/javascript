import { Request, Response, NextFunction } from "express";

const expressAsyncHandler =
  (
    handler: (
      request: Request,
      response: Response,
      next?: NextFunction
    ) => Promise<unknown>
  ) =>
  async (request: Request, response: Response, next?: NextFunction) => {
    try {
      await handler(request, response);
    } catch (err) {
      if (next) {
        next(err);
      }
    }
  };

export default expressAsyncHandler;
