import express from "express";
import type { Express, Request, Response } from "express";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/room";
import chatRoutes from "./routes/chat";
import { errorHandler } from "./middlewares/error-handler";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3100",
  credentials: true,
}))

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use(errorHandler);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
