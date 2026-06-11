import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@repo/database/client";
import { AppError } from "../utils/app-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Known app-level errors (validation, auth, etc.)
  if (error instanceof AppError) {
    const response: { message: string; details?: unknown } = {
      message: error.message,
    };
    if (error.details !== undefined) {
      response.details = error.details;
    }
    return res.status(error.statusCode).json(response);
  }

  // Prisma unique constraint violation (e.g. duplicate email/username)
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const conflictingField = (error.meta?.target as string[])?.[0] ?? "field";
    return res.status(409).json({
      message: `An account already exists for this ${conflictingField}`,
    });
  }

  // Database unreachable (Postgres not running or port not published)
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "ECONNREFUSED"
  ) {
    return res.status(503).json({
      message:
        "Database is unreachable. Ensure PostgreSQL is running and DATABASE_URL in packages/database/.env is correct.",
    });
  }

  // Anything else is an unexpected server error
  console.error("[Unhandled Error]", error);
  return res.status(500).json({ message: "Internal server error" });
}
