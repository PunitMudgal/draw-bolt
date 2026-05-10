import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { getChatsByRoomId } from "../controllers/chat";
import { asyncHandler } from "../middlewares/async-handler";

const router: ExpressRouter = Router();

router.get("/chats/:roomId", asyncHandler(getChatsByRoomId));

export default router;
