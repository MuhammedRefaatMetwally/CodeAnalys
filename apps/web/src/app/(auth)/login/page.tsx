'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.push('/dashboard');
    },
    onError: () => {
      toast( 'Invalid credentials');
    },
  });

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-sm text-green-500 tracking-widest uppercase">DevLens</span>
        </div>
        <div>
          <h1 className="text-5xl font-black leading-tight text-white mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}>
            AI Code Review<br />
            <span className="text-green-500">In Seconds.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
            Paste a GitHub PR URL. Get instant AI-powered feedback on code quality, security, and best practices.
          </p>
        </div>
        <div className="flex gap-8">
          {[[""], [""], [""]].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl font-black text-white">{val}</div>
              <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-zinc-500 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-xs font-mono uppercase tracking-wider">Email</Label>
              <Input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-green-500 focus:ring-green-500/20"
              />
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-xs font-mono uppercase tracking-wider">Password</Label>
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-green-500 focus:ring-green-500/20"
              />
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold tracking-wide transition-all duration-200"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            No account?{' '}
            <Link href="/register" className="text-green-500 hover:text-green-400 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}