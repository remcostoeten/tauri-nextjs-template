import { Suspense } from 'react';
import { AuthFormSkeleton } from '@/module/authentication/ui/auth-form-skeleton';
import { LoginForm } from '@/module/authentication/ui/login-form';

export default function LoginView() {
    return (
        <Suspense fallback={<AuthFormSkeleton variant="login" />}>
            <LoginForm />
        </Suspense>
    );
}
