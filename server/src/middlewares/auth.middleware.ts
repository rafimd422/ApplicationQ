import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/index.js";
import { apiResponse } from "../utils/apiResponse.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return apiResponse(res, 401, "No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret!) as JwtPayload & {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return apiResponse(res, 401, "Invalid token");
  }
};
