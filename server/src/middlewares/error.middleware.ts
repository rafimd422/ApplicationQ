import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    return apiResponse(res, 400, "Validation error", err.errors);
  }

  if (err instanceof ApiError) {
    return apiResponse(res, err.statusCode, err.message);
  }

  return apiResponse(res, 500, "Internal server error");
};
