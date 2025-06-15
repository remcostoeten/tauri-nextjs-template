'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { AppFooter } from "@/module/git/components/app-footer";
import { useSystemTray } from "@/module/git/hooks/use-system-tray";
import { Version } from '@/components/Version';
import { Providers } from "@/components/providers";
import { Toaster } from '@/shared/ui/toast';
import { useAppFooterData } from "@/module/git/hooks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerData = useAppFooterData();
  useSystemTray();

  return (
    <html lang="en" className="dark " suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <AppFooter
            version={footerData.version}
            latest_commit={footerData.latest_commit}
            recent_commits={footerData.recent_commits}
            is_loading={footerData.is_loading}
            is_error={footerData.is_error}
            is_stale={footerData.is_stale}
            is_desktop={footerData.is_desktop}
          />

          <div className="fixed bottom-4 right-4">
            <Version />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}