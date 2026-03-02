'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-zinc-900 px-6 py-3.5 sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-xs text-green-500 tracking-[0.2em] uppercase">
              DevLens
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-mono text-xs text-zinc-600 hidden sm:block">
              {user?.email}
            </span>
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="font-mono text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}