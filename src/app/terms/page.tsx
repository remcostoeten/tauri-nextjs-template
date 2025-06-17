'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <Link 
                        href="/" 
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <Logo />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">
                            Terms of Service
                        </CardTitle>
                        <p className="text-center text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground mb-4">
                                By accessing and using this application ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
                            <p className="text-muted-foreground mb-4">
                                Our Service provides a platform for project management and task organization. We reserve the right to modify, suspend, or discontinue the Service at any time.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
                            <p className="text-muted-foreground mb-4">
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>You must provide accurate and complete information when creating an account</li>
                                <li>You must keep your account information up to date</li>
                                <li>You are responsible for all activities under your account</li>
                                <li>You must notify us immediately of any unauthorized use</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">4. Acceptable Use</h2>
                            <p className="text-muted-foreground mb-4">
                                You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service.
                            </p>
                            <p className="text-muted-foreground mb-4">Prohibited activities include:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Violating any applicable laws or regulations</li>
                                <li>Infringing on intellectual property rights</li>
                                <li>Transmitting malicious code or viruses</li>
                                <li>Attempting to gain unauthorized access to our systems</li>
                                <li>Harassing or abusing other users</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">5. Privacy</h2>
                            <p className="text-muted-foreground mb-4">
                                Your privacy is important to us. Please review our{' '}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>
                                , which also governs your use of the Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
                            <p className="text-muted-foreground mb-4">
                                The Service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
                            <p className="text-muted-foreground mb-4">
                                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms of Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">8. Disclaimer</h2>
                            <p className="text-muted-foreground mb-4">
                                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
                            <p className="text-muted-foreground mb-4">
                                In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
                            <p className="text-muted-foreground mb-4">
                                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">11. Contact Information</h2>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions about these Terms of Service, please contact us through our support channels.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
