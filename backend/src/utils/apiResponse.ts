import { Response } from "express";

export const apiResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null,
) => {
  return res.status(statusCode).json({
    status: statusCode < 400 ? "success" : "error",
    message,
    data,
  });
};
