'use client';

import { useState, useEffect } from 'react';

/**
 * @description Hook to detect if the app is running in Tauri (desktop) or web browser
 * @author Remco Stoeten
 * @returns {Object} Object containing isTauri and isWeb boolean flags
 */

export function usePlatform(): { isTauri: boolean, isWeb: boolean } {
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    const checkTauri = async () => {
      try {
        // Tauri 2.0 detection method
        if (typeof window !== 'undefined') {
          // Check for Tauri 2.0 API
          const { isTauri: tauriCheck } = await import('@tauri-apps/api/core');
          setIsTauri(tauriCheck());
        }
      } catch (error) {
        // Fallback to legacy detection for older versions
        setIsTauri(typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined);
      }
    };

    checkTauri();
  }, []);

  return { isTauri, isWeb: !isTauri };
};