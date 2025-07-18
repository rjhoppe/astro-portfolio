import * as schema from "../../models/schema.ts";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { sql } from "drizzle-orm";

const isDockerized =
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development";
const dbPath = isDockerized ? "/data/db.sqlite3" : "./db.sqlite3";

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: "./drizzle" });

db.run(sql`PRAGMA foreign_keys=ON;`);
