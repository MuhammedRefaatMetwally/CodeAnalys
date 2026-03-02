'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export function LandingCTA() {
  const { isAuthenticated } = useAuthStore();
  const loggedIn = isAuthenticated();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={loggedIn ? '/dashboard' : '/register'}
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20"
      >
        {loggedIn ? 'Go to Dashboard' : 'Get started free'}
        <span className="text-black/70">→</span>
      </Link>
      {!loggedIn && (
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-mono transition-colors px-2 py-2.5"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}