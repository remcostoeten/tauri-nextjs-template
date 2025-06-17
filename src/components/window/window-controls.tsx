
'use client';

import React, { useState, useEffect } from 'react';
import { X, GitCommit } from 'lucide-react';
import { IfTauri } from '@/shared/core/if-tauri';
import { usePlatform } from '@/shared/hooks/use-platform';
import { AppFooter } from '@/module/git/components/app-footer';

export function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { isTauri: isTauriApp } = usePlatform();

  useEffect(() => {
    setIsClient(true);

    if (isTauriApp) {
      const checkMaximized = async () => {
        try {
          const { getCurrentWindow } = await import('@tauri-apps/api/window');
          const currentWindow = getCurrentWindow();
          const maximized = await currentWindow.isMaximized();
          setIsMaximized(maximized);
        } catch (error) {
          console.error('Failed to check window state:', error);
        }
      };
      checkMaximized();
    }
  }, [isTauriApp]);

  async function handleMinimize() {
    if (!isTauriApp) return;

    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const currentWindow = getCurrentWindow();
      await currentWindow.minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  };


  async function handleMaximize() {
    if (!isTauriApp) return;

    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const currentWindow = getCurrentWindow();

      if (isMaximized) {
        await currentWindow.unmaximize();
      } else {
        await currentWindow.maximize();
      }

      const maximized = await currentWindow.isMaximized();
      setIsMaximized(maximized);
    } catch (error) {
      console.error('Failed to toggle maximize:', error);
    }
  };


  async function handleClose() {
    if (!isTauriApp) return;

    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const currentWindow = getCurrentWindow();
      await currentWindow.close();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <IfTauri>
          <header
            className="bg-background/95 backdrop-blur-sm border-b shadow-lg select-none transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-background/98 hover:shadow-xl group"
            data-tauri-drag-region
          >
            <div className="container mx-auto px-4 py-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                    <GitCommit className="w-4 h-4 text-primary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:text-primary/80" />
                    <span className="font-semibold text-foreground hidden sm:inline transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:text-primary">Skibidado</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleMinimize}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    title="Minimize"
                  >
                    <div className="w-3 h-0.5 bg-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"></div>
                  </button>

                  <button
                    onClick={handleMaximize}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    title={isMaximized ? "Restore" : "Maximize"}
                  >
                    <div className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                      {isMaximized ? (
                        <div className="relative w-3 h-3">
                          <div className="w-2.5 h-2.5 border border-current absolute top-0 right-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"></div>
                          <div className="w-2.5 h-2.5 border border-current bg-background absolute bottom-0 left-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"></div>
                        </div>
                      ) : (
                        <div className="w-3 h-3 border border-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"></div>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={handleClose}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive-foreground hover:bg-destructive rounded transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    title="Close"
                  >
                    <X size={12} className="transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
                  </button>
                </div>
              </div>
            </div>
          </header>
      </IfTauri>

      {/* Footer renders on both platforms */}
      <AppFooter />
    </>
  );
};
