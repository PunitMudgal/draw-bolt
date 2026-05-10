import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { signin, signup } from "../controllers/auth";
import { asyncHandler } from "../middlewares/async-handler";

const router: ExpressRouter = Router();

router.post("/signup", asyncHandler(signup));
router.post("/signin", asyncHandler(signin));

export default router;
