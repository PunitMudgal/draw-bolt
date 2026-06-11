import { ShapeSchema, type Shape } from "@repo/common/types";

const HTTP_BASE =
  process.env.NEXT_PUBLIC_HTTP_BACKEND_URL ?? "http://localhost:8000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface RoomInfo {
  id: number;
  name: string;
  slug: string;
}

export async function createRoom(name: string): Promise<{ id: number; name: string }> {
  const res = await fetch(`${HTTP_BASE}/api/v1/room/createroom`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result.message ?? "Failed to create room");
  }
  return { id: result.id, name: result.name };
}

export async function getRoom(slug: string): Promise<RoomInfo | null> {
  const res = await fetch(`${HTTP_BASE}/api/v1/room/room/${encodeURIComponent(slug)}`, {
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    throw new Error("Failed to load room");
  }
  const result = await res.json().catch(() => ({}));
  return (result.room as RoomInfo | null) ?? null;
}

/** Loads persisted chat messages for a room and parses them back into shapes. */
export async function getChats(roomId: number): Promise<Shape[]> {
  const res = await fetch(`${HTTP_BASE}/api/v1/chat/chats/${roomId}`, {
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    throw new Error("Failed to load drawing history");
  }

  const result = await res.json().catch(() => ({}));
  const chats: { message: string }[] = result.chats ?? [];

  const shapes: Shape[] = [];
  for (const chat of chats) {
    const shape = parseShape(chat.message);
    if (shape) shapes.push(shape);
  }
  return shapes;
}

/** Safely parses a stored message string into a Shape, ignoring non-shape data. */
export function parseShape(message: string): Shape | null {
  try {
    const parsed = JSON.parse(message);
    const result = ShapeSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
