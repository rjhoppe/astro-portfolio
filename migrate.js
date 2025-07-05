import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { sql } from "drizzle-orm";

console.log("Starting database migration...");

const isDockerized =
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "development";
const dbPath = isDockerized ? "/data/db.sqlite3" : "./db.sqlite3";

console.log(`Database path: ${dbPath}`);
console.log(`Environment: ${process.env.NODE_ENV}`);

try {
  console.log("Runtime attempting to open database at:", dbPath);
  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite);

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("Enabling foreign keys...");
  db.run(sql`PRAGMA foreign_keys=ON;`);

  console.log("Migration completed successfully");
  sqlite.close();
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}
