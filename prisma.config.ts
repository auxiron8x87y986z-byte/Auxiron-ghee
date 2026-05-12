import * as dotenv from "dotenv";
import path from "path";
import { defineConfig } from "prisma/config";

// Explicitly load .env from the project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Safely construct database URL
const user = encodeURIComponent(process.env.DB_USER || 'root');
const password = encodeURIComponent(process.env.DB_PASSWORD || '');
const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT || '3306';
const name = process.env.DB_NAME || 'auxiron_ghee';

const databaseUrl = process.env.DATABASE_URL || `mysql://${user}:${password}@${host}:${port}/${name}`;


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});

