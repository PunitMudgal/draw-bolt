"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wifi, WifiOff } from "lucide-react";
import type { Shape, Tool } from "@repo/common/types";
import { Game } from "@/draw/Game";
import { getChats } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";
import { Toolbar } from "./Toolbar";

interface CanvasBoardProps {
  roomId: number;
  roomName: string;
  roomSlug: string;
}

export function CanvasBoard({ roomId, roomName, roomSlug }: CanvasBoardProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);

  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState("#e2e8f0");
  const [strokeWidth, setStrokeWidth] = useState(3);

  const handleIncomingShape = useCallback((shape: Shape) => {
    gameRef.current?.addRemoteShape(shape);
  }, []);

  const { connected, sendShape } = useSocket({
    roomId,
    onShape: handleIncomingShape,
  });

  // Keep a stable ref to sendShape so the engine callback always uses the latest.
  const sendShapeRef = useRef(sendShape);
  sendShapeRef.current = sendShape;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new Game(canvas);
    gameRef.current = game;
    game.setOnShapeComplete((shape) => sendShapeRef.current(shape));

    const onResize = () => game.resize();
    window.addEventListener("resize", onResize);

    let cancelled = false;
    getChats(roomId)
      .then((shapes) => {
        if (!cancelled) game.setShapes(shapes);
      })
      .catch(() => {
        /* history load is best-effort */
      });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      game.destroy();
      gameRef.current = null;
    };
  }, [roomId]);

  useEffect(() => {
    gameRef.current?.setTool(tool);
  }, [tool]);

  useEffect(() => {
    gameRef.current?.setStrokeColor(color);
  }, [color]);

  useEffect(() => {
    gameRef.current?.setStrokeWidth(strokeWidth);
  }, [strokeWidth]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none cursor-crosshair"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/rooms")}
          className="pointer-events-auto flex h-10 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 text-sm text-slate-200 shadow-lg backdrop-blur hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          Rooms
        </button>
        <div className="pointer-events-auto flex h-10 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 text-sm text-slate-200 shadow-lg backdrop-blur">
          <span className="font-medium text-white">{roomName}</span>
          <span className="text-slate-500">/{roomSlug}</span>
          {connected ? (
            <Wifi size={16} className="text-emerald-400" />
          ) : (
            <WifiOff size={16} className="text-red-400" />
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
        <Toolbar
          tool={tool}
          onToolChange={setTool}
          color={color}
          onColorChange={setColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          onClear={() => gameRef.current?.clear()}
        />
      </div>
    </div>
  );
}
