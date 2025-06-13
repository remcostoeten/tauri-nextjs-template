'use client';

import { Waves } from '@/components/effects/waves';
import { Logo } from '@/components/logo';
import { register } from '@/module/authentication/api/mutations/register';
import { DiscordLoginButton } from '@/module/authentication/ui/discord-login';
import { GitHubLoginButton } from '@/module/authentication/ui/github-login';
import { GoogleLoginButton } from '@/module/authentication/ui/google-login';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, Card, CardContent, Input, Label, toast } from '@/shared/ui';
import { cn } from '@/shared/helpers';

function RegisterButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Creating account...' : 'Create account'}
        </Button>
    );
}

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const formRef = useRef<HTMLFormElement>(null);
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
            const result = await register(formData);

            if (!result?.success) {
                toast.error(result?.error || 'Failed to create account');
                formRef.current?.reset();
                return;
            }

            toast.success('Account created successfully! Redirecting...');
            router.push(result.redirect ?? '/space');
        } catch (e) {
            if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) return;
            toast.error(
                `Registration failed - ${e instanceof Error ? e.message : 'An unexpected error occurred'
                }`
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
                                    Create an account
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Sign up for your account
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" type="text" required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>

                            <RegisterButton />

                            <div className="pb-6 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <GitHubLoginButton className="w-full" />
                                <GoogleLoginButton className="w-full" />
                                <DiscordLoginButton className="w-full" />
                            </div>

                            <div className="text-center text-sm">
                                Already have an account?{' '}
                                <Link href="/login" className="underline underline-offset-4">
                                    Login here
                                </Link>
                            </div>
                        </form>

                        <div className="relative hidden h-full min-h-[500px] bg-muted md:block overflow-hidden">
                            <Waves backgroundColor="transparent" waveSpeedX={0.02} waveSpeedY={0.01} />
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
