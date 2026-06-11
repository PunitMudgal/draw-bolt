"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white">
              Draw<span className="text-blue-400">Bolt</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#collaboration"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Collaboration
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/sign-in"
              className="px-6 py-2 text-slate-300 hover:text-white transition-colors border border-slate-700 rounded-lg hover:border-slate-600"
            >
              Sign In
            </Link>
            <Link
              href="/rooms"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Start Drawing
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-800">
            <a
              href="#features"
              className="block py-2 text-slate-300 hover:text-white"
            >
              Features
            </a>
            <a
              href="#collaboration"
              className="block py-2 text-slate-300 hover:text-white"
            >
              Collaboration
            </a>
            <a
              href="#pricing"
              className="block py-2 text-slate-300 hover:text-white"
            >
              Pricing
            </a>
            <div className="flex gap-4 mt-4">
              <Link
                href="/sign-in"
                className="px-6 py-2 text-slate-300 border border-slate-700 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/rooms"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              >
                Start Drawing
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
