'use client'

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import {WindowControls} from "@/components/window/window-controls";
import { Toaster } from "@/shared/ui/sonner";
import { ThemeProvider } from '@/styles/themes';
import { PlatformDebug } from '@/components/debug/platform-debug';

const inter = Inter({ subsets: ["latin"] });

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <ThemeProvider>
          <WindowControls />
          {children}
          <PlatformDebug />
          <Toaster />
        </ThemeProvider>
      </Providers>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}