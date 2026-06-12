import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username may only contain letters, numbers, and underscores"),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(3).max(100),
});

export const SignInSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(8).max(128),
});

export const CreateRoomSchema = z.object({
  name: z.string().trim().min(3).max(100),
});

// --- Drawing shapes (shared between frontend and backends) ---

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const ShapeBaseSchema = z.object({
  id: z.string(),
  strokeColor: z.string(),
  strokeWidth: z.number(),
});

export const RectShapeSchema = ShapeBaseSchema.extend({
  type: z.literal("rect"),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const EllipseShapeSchema = ShapeBaseSchema.extend({
  type: z.literal("ellipse"),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const LineShapeSchema = ShapeBaseSchema.extend({
  type: z.literal("line"),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
});

export const PencilShapeSchema = ShapeBaseSchema.extend({
  type: z.literal("pencil"),
  points: z.array(PointSchema),
});

export const ShapeSchema = z.discriminatedUnion("type", [
  RectShapeSchema,
  EllipseShapeSchema,
  LineShapeSchema,
  PencilShapeSchema,
]);

export type Point = z.infer<typeof PointSchema>;
export type Shape = z.infer<typeof ShapeSchema>;
export type RectShape = z.infer<typeof RectShapeSchema>;
export type EllipseShape = z.infer<typeof EllipseShapeSchema>;
export type LineShape = z.infer<typeof LineShapeSchema>;
export type PencilShape = z.infer<typeof PencilShapeSchema>;

export type Tool = "pencil" | "rect" | "ellipse" | "line" | "pan";
