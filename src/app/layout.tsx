'use client'

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AppFooter } from "@/module/git/components/app-footer";
import { useSystemTray } from "@/module/git/hooks/use-system-tray";
import { Version } from '@/components/Version';
import { Providers } from "@/components/providers";
import { Toaster } from '@/shared/ui/toast';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useSystemTray();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <AppFooter />
          <div className="fixed bottom-4 right-4">
            <Version />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
