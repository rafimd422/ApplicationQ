import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};
