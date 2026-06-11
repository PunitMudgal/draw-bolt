import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { Options } from "roughjs/bin/core";
import type { Shape, Tool } from "@repo/common/types";

type Point = { x: number; y: number };

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Generates a stable numeric seed from a shape id so rough.js renders the same
 * hand-drawn jitter on every redraw (and on every client).
 */
function seedFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rc: RoughCanvas;

  private shapes: Shape[] = [];
  private shapeIds = new Set<string>();

  private tool: Tool = "pencil";
  private strokeColor = "#e2e8f0";
  private strokeWidth = 3;

  private drawing = false;
  private startPoint: Point = { x: 0, y: 0 };
  private currentPoints: Point[] = [];

  private onShapeComplete?: (shape: Shape) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.rc = rough.canvas(canvas);
    this.resize();

    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointerleave", this.onPointerUp);
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointerleave", this.onPointerUp);
  }

  setTool(tool: Tool) {
    this.tool = tool;
  }

  setStrokeColor(color: string) {
    this.strokeColor = color;
  }

  setStrokeWidth(width: number) {
    this.strokeWidth = width;
  }

  setOnShapeComplete(cb: (shape: Shape) => void) {
    this.onShapeComplete = cb;
  }

  /** Replace all shapes (used when loading history). */
  setShapes(shapes: Shape[]) {
    this.shapes = [];
    this.shapeIds.clear();
    for (const shape of shapes) {
      if (!this.shapeIds.has(shape.id)) {
        this.shapes.push(shape);
        this.shapeIds.add(shape.id);
      }
    }
    this.redraw();
  }

  /** Add a shape received from another client; dedupes our own echo by id. */
  addRemoteShape(shape: Shape) {
    if (this.shapeIds.has(shape.id)) {
      return;
    }
    this.shapes.push(shape);
    this.shapeIds.add(shape.id);
    this.redraw();
  }

  clear() {
    this.shapes = [];
    this.shapeIds.clear();
    this.redraw();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.redraw();
  }

  private getPos(e: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private onPointerDown = (e: PointerEvent) => {
    if (this.tool === "pan") return;
    this.drawing = true;
    this.startPoint = this.getPos(e);
    this.currentPoints = [this.startPoint];
    this.canvas.setPointerCapture?.(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.drawing) return;
    const pos = this.getPos(e);

    if (this.tool === "pencil") {
      this.currentPoints.push(pos);
    }

    this.redraw();
    this.drawPreview(pos);
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.drawing) return;
    this.drawing = false;
    const pos = this.getPos(e);
    const shape = this.buildShape(pos);
    this.currentPoints = [];

    if (!shape) {
      this.redraw();
      return;
    }

    this.shapes.push(shape);
    this.shapeIds.add(shape.id);
    this.redraw();
    this.onShapeComplete?.(shape);
  };

  private buildShape(end: Point): Shape | null {
    const start = this.startPoint;
    const base = {
      id: createId(),
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
    };

    if (this.tool === "pencil") {
      if (this.currentPoints.length < 2) return null;
      return { ...base, type: "pencil", points: this.currentPoints.slice() };
    }

    if (this.tool === "rect") {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);
      if (width < 2 && height < 2) return null;
      return { ...base, type: "rect", x, y, width, height };
    }

    if (this.tool === "ellipse") {
      const cx = (start.x + end.x) / 2;
      const cy = (start.y + end.y) / 2;
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);
      if (width < 2 && height < 2) return null;
      return { ...base, type: "ellipse", x: cx, y: cy, width, height };
    }

    if (this.tool === "line") {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return null;
      return {
        ...base,
        type: "line",
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
      };
    }

    return null;
  }

  private drawPreview(end: Point) {
    const start = this.startPoint;
    const options: Options = {
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      roughness: 1,
      seed: 1,
    };

    if (this.tool === "pencil") {
      if (this.currentPoints.length < 2) return;
      this.rc.linearPath(
        this.currentPoints.map((p) => [p.x, p.y] as [number, number]),
        options,
      );
    } else if (this.tool === "rect") {
      this.rc.rectangle(
        Math.min(start.x, end.x),
        Math.min(start.y, end.y),
        Math.abs(end.x - start.x),
        Math.abs(end.y - start.y),
        options,
      );
    } else if (this.tool === "ellipse") {
      this.rc.ellipse(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2,
        Math.abs(end.x - start.x),
        Math.abs(end.y - start.y),
        options,
      );
    } else if (this.tool === "line") {
      this.rc.line(start.x, start.y, end.x, end.y, options);
    }
  }

  private redraw() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const shape of this.shapes) {
      this.drawShape(shape);
    }
  }

  private drawShape(shape: Shape) {
    const options: Options = {
      stroke: shape.strokeColor,
      strokeWidth: shape.strokeWidth,
      roughness: 1,
      seed: seedFromId(shape.id),
    };

    switch (shape.type) {
      case "rect":
        this.rc.rectangle(shape.x, shape.y, shape.width, shape.height, options);
        break;
      case "ellipse":
        this.rc.ellipse(shape.x, shape.y, shape.width, shape.height, options);
        break;
      case "line":
        this.rc.line(shape.x1, shape.y1, shape.x2, shape.y2, options);
        break;
      case "pencil":
        if (shape.points.length >= 2) {
          this.rc.linearPath(
            shape.points.map((p) => [p.x, p.y] as [number, number]),
            options,
          );
        }
        break;
    }
  }
}
