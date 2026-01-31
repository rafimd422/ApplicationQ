import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema/index.js";
import { config } from "./env.js";

const pool = new Pool({
  connectionString: config.databaseUrl,
});

export const db = drizzle(pool, { schema });
export { pool };
