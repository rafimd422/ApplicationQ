import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import routes from "./modules/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();


app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});


app.use("/api", routes);


app.use(errorMiddleware);

export default app;
