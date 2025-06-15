import { AuthFormSkeleton } from "@/module/authentication/ui/auth-form-skeleton";
import { RegisterForm } from "@/module/authentication/ui/register-form";
import { Suspense } from "react";

export default function RegisterView() {
    return (
        <Suspense fallback={<AuthFormSkeleton variant="register" />}>
            <RegisterForm />
        </Suspense>
    );
}
