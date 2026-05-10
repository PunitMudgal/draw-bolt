import type { Request, Response } from "express";
import { prismaClient } from "@repo/database/client";
import { AppError } from "../utils/app-error";

export const getChatsByRoomId = async (req: Request, res: Response) => {
  const roomId = Number(req.params.roomId);
  if (!Number.isInteger(roomId) || roomId <= 0) {
    throw new AppError("Invalid room id", 400);
  }

  const chats = await prismaClient.chat.findMany({
    where: { roomId },
    take: 100,
    orderBy: { createdAt: "asc" },
  });

  return res.json({ chats });
};
