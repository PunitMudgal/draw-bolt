"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom, getRoom, getToken } from "@/lib/api";

function slugify(name: string): string {
  return name.trim().replace(/\s+/g, "-").toLowerCase();
}

export default function RoomsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const [createName, setCreateName] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/sign-in");
      return;
    }
    setChecking(false);
  }, [router]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createRoom(createName);
      router.push(`/canvas/${slugify(createName)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const onJoin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const slug = slugify(joinSlug);
      const room = await getRoom(slug);
      if (!room) {
        setError(`Room "${slug}" was not found.`);
        return;
      }
      router.push(`/canvas/${room.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_40%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.14),transparent_45%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            DrawBolt
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Your boards</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create a new whiteboard or join an existing room by name.
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <form
            onSubmit={onCreate}
            className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-6 backdrop-blur"
          >
            <h2 className="text-lg font-medium text-white">Create a room</h2>
            <p className="mt-1 text-sm text-slate-400">
              Start a fresh board (min 3 characters).
            </p>
            <input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              required
              minLength={3}
              placeholder="My design board"
              className="mt-4 h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-11 w-full rounded-lg bg-linear-to-r from-blue-600 to-violet-600 text-sm font-medium text-white transition hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Please wait..." : "Create & open"}
            </button>
          </form>

          <form
            onSubmit={onJoin}
            className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-6 backdrop-blur"
          >
            <h2 className="text-lg font-medium text-white">Join a room</h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter the room name to collaborate.
            </p>
            <input
              value={joinSlug}
              onChange={(e) => setJoinSlug(e.target.value)}
              required
              placeholder="my-design-board"
              className="mt-4 h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-11 w-full rounded-lg border border-slate-700 bg-slate-800 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Please wait..." : "Join board"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
