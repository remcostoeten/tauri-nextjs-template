'use client';

import React, { useState } from 'react';
import { usePlatform } from '@/shared/hooks/use-platform';

export function PlatformDebug() {
  const [isVisible, setIsVisible] = useState(false);
  const [versionTest, setVersionTest] = useState<string>('');
  const { isTauri: isTauriApp } = usePlatform();

  const testTauriVersion = async () => {
    if (!isTauriApp) {
      setVersionTest('Not in Tauri environment');
      return;
    }

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const version = await invoke('get_current_version') as string;
      setVersionTest(`Success: ${version}`);
    } catch (error) {
      setVersionTest(`Error: ${error}`);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-20 opacity-20 hover:opacity-100  duration-300 -right-[20px] hover:right-4 transition-all z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-mono"
      >
        DEBUG
      </button>

      {isVisible && (
        <div className="mt-2 p-4 bg-black/90 border border-purple-500 rounded-lg backdrop-blur-sm max-w-sm">
          <h3 className="text-purple-400 font-semibold mb-3 text-sm">Platform Debug Info</h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">Tauri Detection:</span>
              <span className={isTauriApp ? 'text-green-400' : 'text-red-400'}>
                {isTauriApp ? 'TRUE ✅' : 'FALSE ❌'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Environment:</span>
              <span className="text-blue-400">
                {process.env.NODE_ENV}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Window API:</span>
              <span className={typeof window !== 'undefined' ? 'text-green-400' : 'text-red-400'}>
                {typeof window !== 'undefined' ? 'Available' : 'Not Available'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">__TAURI__ Global:</span>
              <span className={typeof window !== 'undefined' && (window as any).__TAURI__ ? 'text-green-400' : 'text-red-400'}>
                {typeof window !== 'undefined' && (window as any).__TAURI__ ? 'Present' : 'Not Present'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">User Agent:</span>
              <span className="text-yellow-400 text-[10px] break-all">
                {typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 30) + '...' : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
