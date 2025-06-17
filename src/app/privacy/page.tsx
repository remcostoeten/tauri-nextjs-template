'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
                            Privacy Policy
                        </CardTitle>
                        <p className="text-center text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                            <p className="text-muted-foreground mb-4">
                                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                            </p>
                            
                            <h3 className="text-lg font-medium mb-2 mt-6">Personal Information</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Name and email address</li>
                                <li>Account credentials</li>
                                <li>Profile information</li>
                                <li>Communication preferences</li>
                            </ul>

                            <h3 className="text-lg font-medium mb-2 mt-6">Usage Information</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>How you interact with our service</li>
                                <li>Features you use and time spent</li>
                                <li>Device and browser information</li>
                                <li>IP address and location data</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground mb-4">
                                We use the information we collect to provide, maintain, and improve our services.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Provide and operate our service</li>
                                <li>Process transactions and send notifications</li>
                                <li>Respond to your comments and questions</li>
                                <li>Improve our service and develop new features</li>
                                <li>Detect and prevent fraud and abuse</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
                            <p className="text-muted-foreground mb-4">
                                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                            </p>
                            
                            <h3 className="text-lg font-medium mb-2 mt-6">We may share information:</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>With service providers who assist in our operations</li>
                                <li>To comply with legal requirements</li>
                                <li>To protect our rights and safety</li>
                                <li>In connection with a business transfer</li>
                                <li>With your explicit consent</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                            <p className="text-muted-foreground mb-4">
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments</li>
                                <li>Access controls and authentication</li>
                                <li>Employee training on data protection</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
                            <p className="text-muted-foreground mb-4">
                                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
                            <p className="text-muted-foreground mb-4">
                                Depending on your location, you may have certain rights regarding your personal information:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Access to your personal information</li>
                                <li>Correction of inaccurate data</li>
                                <li>Deletion of your personal information</li>
                                <li>Restriction of processing</li>
                                <li>Data portability</li>
                                <li>Objection to processing</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">7. Cookies and Tracking</h2>
                            <p className="text-muted-foreground mb-4">
                                We use cookies and similar tracking technologies to enhance your experience and analyze usage patterns.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Essential cookies for service functionality</li>
                                <li>Analytics cookies to understand usage</li>
                                <li>Preference cookies to remember your settings</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">8. Third-Party Services</h2>
                            <p className="text-muted-foreground mb-4">
                                Our service may contain links to third-party websites or integrate with third-party services. This privacy policy does not apply to those external services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">9. Children's Privacy</h2>
                            <p className="text-muted-foreground mb-4">
                                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">10. Changes to This Policy</h2>
                            <p className="text-muted-foreground mb-4">
                                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions about this Privacy Policy or our data practices, please contact us through our support channels.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
