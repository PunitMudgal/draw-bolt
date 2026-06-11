"use client";

import type { Tool } from "@repo/common/types";
import { Pencil, Square, Circle, Minus, Trash2 } from "lucide-react";

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  color: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  onClear: () => void;
}

const TOOLS: { id: Tool; label: string; Icon: typeof Pencil }[] = [
  { id: "pencil", label: "Pencil", Icon: Pencil },
  { id: "rect", label: "Rectangle", Icon: Square },
  { id: "ellipse", label: "Ellipse", Icon: Circle },
  { id: "line", label: "Line", Icon: Minus },
];

const COLORS = ["#e2e8f0", "#f87171", "#facc15", "#4ade80", "#60a5fa", "#c084fc"];
const WIDTHS = [2, 4, 7];

export function Toolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  onClear,
}: ToolbarProps) {
  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 shadow-2xl backdrop-blur">
      <div className="flex items-center gap-1">
        {TOOLS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            onClick={() => onToolChange(id)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
              tool === id
                ? "bg-blue-500 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      <div className="mx-1 h-6 w-px bg-slate-700" />

      <div className="flex items-center gap-1.5">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            title={c}
            aria-label={`Color ${c}`}
            onClick={() => onColorChange(c)}
            className={`h-6 w-6 rounded-full border-2 transition ${
              color === c ? "scale-110 border-white" : "border-transparent"
            }`}
            style={{ background: c }}
          />
        ))}
      </div>

      <div className="mx-1 h-6 w-px bg-slate-700" />

      <div className="flex items-center gap-1">
        {WIDTHS.map((w) => (
          <button
            key={w}
            type="button"
            title={`Stroke ${w}px`}
            aria-label={`Stroke width ${w}`}
            onClick={() => onStrokeWidthChange(w)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
              strokeWidth === w
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span
              className="rounded-full bg-current"
              style={{ width: w + 2, height: w + 2 }}
            />
          </button>
        ))}
      </div>

      <div className="mx-1 h-6 w-px bg-slate-700" />

      <button
        type="button"
        title="Clear board"
        aria-label="Clear board"
        onClick={onClear}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-500/20 hover:text-red-300"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
