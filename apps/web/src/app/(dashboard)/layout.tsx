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
    <div className="min-h-screen bg-[#080808]">
      <nav className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-sm text-green-500 tracking-widest uppercase">
              DevLens
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500 text-sm font-mono">{user?.email}</span>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className="text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}