'use client'

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AppFooter } from "@/module/git/components/app-footer";
import { useSystemTray } from "@/module/git/hooks/use-system-tray";
import { Version } from '@/components/Version';
import { Providers } from "@/components/providers";
import { Toaster } from '@/shared/ui/toast';
import { useAppFooterData } from "@/module/git/hooks";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerData = useAppFooterData();
  useSystemTray();

  return (
    <html lang="en">
      <body className={inter.className}>
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
