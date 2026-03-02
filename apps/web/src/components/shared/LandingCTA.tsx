'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export function LandingCTA() {
  const { isAuthenticated } = useAuthStore();
  const loggedIn = isAuthenticated();

  const href = loggedIn ? '/dashboard' : '/register';
  const label = loggedIn ? 'Go to Dashboard →' : 'Start Reviewing Free →';

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href={href}
        className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:scale-105"
      >
        {label}
      </Link>
      {!loggedIn && (
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-mono px-8 py-4 rounded-xl text-sm transition-colors"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}