import React from "react";

const AuthPage = ({ isSignIn }: { isSignIn: boolean }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.14),_transparent_45%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800/90 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-7 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              DrawBoard
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {isSignIn ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {isSignIn
                ? "Sign in to continue to your whiteboard workspace."
                : "Sign up and start collaborating on boards in seconds."}
            </p>
          </div>

          <form className="space-y-4">
            {!isSignIn && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-slate-300">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-slate-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              className="mt-2 h-11 w-full rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-medium text-white transition hover:from-blue-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {isSignIn ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isSignIn ? "New to DrawBoard?" : "Already have an account?"}{" "}
            <a
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
