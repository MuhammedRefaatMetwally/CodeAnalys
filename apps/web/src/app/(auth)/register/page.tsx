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
import { toast} from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.push('/dashboard');
    },
    onError: () => {
      toast( 'Registration failed. Email may already be in use.');
    },
  });

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-sm text-green-500 tracking-widest uppercase">DevLens</span>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
          <p className="text-zinc-500 text-sm">Start reviewing code with AI</p>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-zinc-300 text-xs font-mono uppercase tracking-wider">Name</Label>
            <Input
              {...register('name')}
              placeholder="Muhammed"
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-green-500 focus:ring-green-500/20"
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

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
            {isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-green-500 hover:text-green-400 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}