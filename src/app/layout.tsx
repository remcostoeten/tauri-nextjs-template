'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Version } from '@/components/Version';
import { Providers } from "@/components/providers";
import { Toaster } from "@/shared/ui/sonner";
import { ThemeProvider } from '@/styles/themes';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <ThemeProvider>
          <div className="max-h-[100vh]">
            
            {children}
            </div>
          <div className="fixed bottom-4 right-4">
            <Version />
          </div>
          <Toaster />
        </ThemeProvider>
      </Providers>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}