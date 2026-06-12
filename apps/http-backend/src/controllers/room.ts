import type { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/database/client";
import { AppError } from "../utils/app-error";

export const createRoom = async (req: Request, res: Response) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    throw new AppError(data.error.message, 400);
  }

  const userId = req.userId;
  if (!userId) {
    throw new AppError("User id in request not found", 401);
  }

  const slug = data.data.name
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 120);

  const room = await prismaClient.room.create({
    data: {
      name: data.data.name,
      slug,
      adminId: userId,
    },
  });

  return res.json({ message: "Room created", name: room.name, id: room.id });
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  if (typeof slug !== "string") {
    throw new AppError("Invalid room slug", 400);
  }

  const room = await prismaClient.room.findFirst({
    where: { slug },
  });

  return res.json({ room });
};
