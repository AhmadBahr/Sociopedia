import { NextFunction, Request, Response } from "express";

export function asyncHandler<
  Req extends Request = Request,
  Res extends Response = Response
>(handler: (req: Req, res: Res, next: NextFunction) => Promise<any>) {
  return (req: Req, res: Res, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

