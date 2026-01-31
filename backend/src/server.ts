import app from "./app.js";
import { pool, config } from "./config/index.js";
import { logger } from "./utils/logger.js";

export const startServer = async () => {
  try {

    const client = await pool.connect();
    logger.info("✅ Database connected successfully");
    client.release();

    app.listen(config.port, () => {
      logger.info(`🚀 Server running on http://localhost:${config.port}`);
      logger.info(`📊 Health check: http://localhost:${config.port}/health`);
    });
  } catch (err) {
    logger.error("❌ Failed to connect to the database:", err);
    process.exit(1);
  }
};
