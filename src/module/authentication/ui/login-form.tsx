'use client';

import { Waves } from '@/components/effects/waves';
import { Logo } from '@/components/logo';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/helpers';
import Link from 'next/link';
import { toast } from '@/components/toast';
import { login } from '../api/mutations/login';
import { DiscordLoginButton } from './discord-login';
import { GitHubLoginButton } from './github-login';
import { GoogleLoginButton } from './google-login';

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    );
}

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const formRef = useRef<HTMLFormElement>(null);
    const { theme } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const toastType = searchParams.get('toast');
        const message = searchParams.get('message');
        const error = searchParams.get('error');

        if (toastType === 'error' && message) {
            toast.error(message);
        }

        if (toastType || message || error) {
            const url = new URL(window.location.href);
            url.searchParams.delete('toast');
            url.searchParams.delete('message');
            url.searchParams.delete('error');
            window.history.replaceState({}, '', url);
        }
    }, [searchParams]);

    async function handleSubmit(formData: FormData) {
        try {
            const result = await login(formData);

            if (!result.success) {
                toast.error(`Login failed - ${result.error || 'Authentication failed'}`);
                formRef.current?.reset();
                return;
            }

            toast.success('Login successful - Redirecting...');

            const redirectTo = searchParams.get('redirect') || result.redirect || '/space';
            router.push(redirectTo);
        } catch (e) {
            if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) return;
            toast.error(
                `Login failed - ${e instanceof Error ? e.message : 'An unexpected error occurred'}`
            );
            formRef.current?.reset();
        }
    }

    return (
        <div className={cn('flex min-h-screen items-center justify-center', className)} {...props}>
            <div className="w-full max-w-[720px] px-4">
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>

                <Card className="overflow-hidden py-0">
                    <CardContent className="grid p-0 md:grid-cols-2 h-full">
                        <form
                            ref={formRef}
                            action={handleSubmit}
                            className="pt-6 flex flex-col gap-6 p-6 md:p-8"
                        >
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent animate-gradient-x">
                                    Welcome back
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your Acme Inc account
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                                    Remember me
                                </Label>
                            </div>

                            <LoginButton />

                            <div className="pb-6 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <GitHubLoginButton
                                    className="w-full"
                                    redirectTo={searchParams.get('redirect') || '/space'}
                                />
                                <GoogleLoginButton
                                    className="w-full"
                                    redirectTo={searchParams.get('redirect') || '/space'}
                                />
                                <DiscordLoginButton
                                    className="w-full"
                                    redirectTo={searchParams.get('redirect') || '/space'}
                                />
                            </div>

                            <div className="text-center text-sm">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>
                        </form>

                        <div className="relative hidden h-full min-h-[500px] bg-muted md:block overflow-hidden">
                            <Waves
                                backgroundColor="transparent"
                                lineColor={
                                    theme === 'dark'
                                        ? 'rgba(255,255,255,0.3)'
                                        : 'rgba(0,0,0,0.3)'
                                }
                                waveSpeedX={0.02}
                                waveSpeedY={0.01}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-4 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                    By continuing, you agree to our <Link href="#">Terms of Service</Link> and{' '}
                    <Link href="#">Privacy Policy</Link>.
                </div>
            </div>
        </div>
    );
}
