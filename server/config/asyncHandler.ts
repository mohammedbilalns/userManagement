import { RequestHandler, NextFunction } from "express";

export const asyncHandler =
  <
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    LocalsObj extends Record<string, any> = Record<string, any>
  >(
    fun: (
      ...args: Parameters<
        RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
      >
    ) => void
  ) =>
  (
    ...args: Parameters<
      RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj>
    >
  ) => {
    const next = args[args.length - 1];
    Promise.resolve(fun(...args)).catch(next as NextFunction);
  };
