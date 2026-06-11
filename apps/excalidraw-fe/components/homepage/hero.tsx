'use client';

import Link from 'next/link';
import { ArrowRight, Play, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 sm:px-6 lg:px-8 pt-20 pb-40 md:pt-24 md:pb-52">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[110px]" />
        <div className="absolute top-36 right-0 h-[320px] w-[320px] rounded-full bg-cyan-500/15 blur-[110px]" />
      </div>

      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-7 rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 backdrop-blur">
          <Zap size={16} className="text-blue-400" />
          <span className="text-sm text-slate-300">Realtime collaboration in your browser</span>
        </div>

        <h1 className="text-balance text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
          Sketch ideas at the
          <span className="bg-linear-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {' '}
            speed of thought
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-slate-300 sm:text-xl">
          A hand-drawn style whiteboard for diagrams, planning, and team brainstorms -
          collaborative, fast, and beautifully simple.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/rooms"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 px-8 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Start drawing - it&apos;s free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-8 py-3 font-semibold text-white transition hover:border-slate-500">
            <Play size={16} className="text-slate-300" />
            Watch demo
          </button>
        </div>

        {/* <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-8 border-t border-slate-800/80 pt-10">
          <div>
            <div className="text-3xl font-bold text-white">100K+</div>
            <p className="mt-2 text-sm text-slate-400">Active users</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">50M+</div>
            <p className="mt-2 text-sm text-slate-400">Boards created</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">99.9%</div>
            <p className="mt-2 text-sm text-slate-400">Uptime</p>
          </div>
        </div> */}
      </div>

    </section>
  );
}
