
export default function RegisterPage() {
    return (
        <Suspense fallback={<AuthFormSkeleton variant="register" />}>
            <RegisterForm />
        </Suspense>
    );
}
