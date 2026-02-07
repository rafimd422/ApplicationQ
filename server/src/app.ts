import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import routes from "./modules/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiResponse } from "./utils/apiResponse.js";

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  return apiResponse(res, 200, "Health check successful", {
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
