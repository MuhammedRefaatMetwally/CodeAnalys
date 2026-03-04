'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export function LandingNav() {
  const { isAuthenticated } = useAuthStore();
  const loggedIn = isAuthenticated();

  return (
    <nav className="border-b border-zinc-900 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-sm text-green-500 tracking-widest uppercase">
            CodeAnalys
          </span>
        </div>
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm font-mono bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-mono text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-mono bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}