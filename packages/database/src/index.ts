import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client-runtime-utils";
import { PrismaPg } from "@prisma/adapter-pg";

// Load the package-local env file so workspace apps do not need to set DATABASE_URL
// themselves before importing the shared database client.
const envPathCandidates = [
  path.resolve(process.cwd(), "packages/database/.env"),
  path.resolve(process.cwd(), "../../packages/database/.env"),
];

const resolvedEnvPath =
  envPathCandidates.find((candidate) => fs.existsSync(candidate)) ??
  envPathCandidates[0];

dotenv.config({ path: resolvedEnvPath });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for @repo/database. Set it in packages/database/.env or the environment before starting the backend.",
  );
}

export const prismaClient = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

export const Prisma = {
  PrismaClientKnownRequestError,
} as const;
