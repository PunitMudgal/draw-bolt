import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { middleware } from "../middlewares/middleware";
import { createRoom, getRoomBySlug } from "../controllers/room";
import { asyncHandler } from "../middlewares/async-handler";

const router: ExpressRouter = Router();

router.post("/createroom", middleware, asyncHandler(createRoom));
router.get("/room/:slug", asyncHandler(getRoomBySlug));

export default router;
