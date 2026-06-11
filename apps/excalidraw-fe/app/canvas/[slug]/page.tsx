"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CanvasBoard } from "@/components/canvas/CanvasBoard";
import { getRoom, getToken, type RoomInfo } from "@/lib/api";

export default function CanvasPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">(
    "loading",
  );

  useEffect(() => {
    if (!getToken()) {
      router.replace("/sign-in");
      return;
    }
    if (!slug) return;

    let cancelled = false;
    getRoom(slug)
      .then((r) => {
        if (cancelled) return;
        if (r) {
          setRoom(r);
          setStatus("ready");
        } else {
          setStatus("notfound");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("notfound");
      });

    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-300">
        Loading board...
      </div>
    );
  }

  if (status === "notfound" || !room) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-300">
        <p>Room &quot;{slug}&quot; was not found.</p>
        <button
          type="button"
          onClick={() => router.push("/rooms")}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          Back to rooms
        </button>
      </div>
    );
  }

  return (
    <CanvasBoard roomId={room.id} roomName={room.name} roomSlug={room.slug} />
  );
}
