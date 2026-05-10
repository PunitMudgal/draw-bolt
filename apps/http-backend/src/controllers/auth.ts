import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SignInSchema } from "@repo/common/types";
import { prismaClient } from "@repo/database/client";
import { AppError } from "../utils/app-error";

export const signup = async (req: Request, res: Response) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    throw new AppError(data.error.message, 400);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.data.password, saltRounds);

  await prismaClient.user.create({
    data: {
      email: data.data.email,
      username: data.data.username,
      password: hashedPassword,
      name: data.data.name,
    },
  });

  return res.status(201).json({ message: "User signed up successfully" });
};

export const signin = async (req: Request, res: Response) => {
  const data = SignInSchema.safeParse(req.body);
  if (!data.success) {
    throw new AppError(data.error.message, 400);
  }

  const { email, password } = data.data;
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
  if (!token) {
    throw new AppError("Failed to generate token", 500);
  }

  return res.json({ message: "User signed in", token });
};
