import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

export const client = new Client({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_NAME || "movies",
});

client
  .connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL database successfully.");
  })
  .catch((err) => {
    console.error("❌ Failed to connect to PostgreSQL database:", err);
  });

export const db = drizzle(client, { schema });

process.on("SIGINT", () => {
  client
    .end()
    .then(() => {
      console.log("👋 PostgreSQL client disconnected.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error during PostgreSQL client disconnection:", err);
      process.exit(1);
    });
});
