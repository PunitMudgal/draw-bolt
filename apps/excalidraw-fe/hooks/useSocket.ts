"use client";

import { useEffect, useRef, useState } from "react";
import type { Shape } from "@repo/common/types";
import { getToken, parseShape } from "@/lib/api";

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8001";

interface UseSocketOptions {
  roomId: number | null;
  onShape: (shape: Shape) => void;
}

/**
 * Connects to the ws-backend, joins the room, and relays drawing shapes over the
 * existing "chat" message pipeline (shape serialized as JSON into `message`).
 */
export function useSocket({ roomId, onShape }: UseSocketOptions) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  // Keep latest callback without forcing reconnects.
  const onShapeRef = useRef(onShape);
  onShapeRef.current = onShape;

  useEffect(() => {
    if (roomId == null) return;
    const token = getToken();
    if (!token) return;

    const ws = new WebSocket(`${WS_BASE}?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: "join_room", roomId: String(roomId) }));
    };

    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      let data: { type?: string; message?: string };
      try {
        data = JSON.parse(typeof event.data === "string" ? event.data : "");
      } catch {
        return;
      }
      if (data.type === "chat" && typeof data.message === "string") {
        const shape = parseShape(data.message);
        if (shape) onShapeRef.current(shape);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "leave_room", roomId: String(roomId) }));
      }
      ws.close();
      wsRef.current = null;
    };
  }, [roomId]);

  const sendShape = (shape: Shape) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || roomId == null) return;
    ws.send(
      JSON.stringify({
        type: "chat",
        roomId: String(roomId),
        message: JSON.stringify(shape),
      }),
    );
  };

  return { connected, sendShape };
}
