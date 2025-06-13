'use client'

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AppFooter } from "@/module/git/components/app-footer";
import { useSystemTray } from "@/module/git/hooks/use-system-tray";

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
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
