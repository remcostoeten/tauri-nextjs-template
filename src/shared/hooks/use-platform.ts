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
    setIsTauri(typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined);
  }, []);

  return { isTauri, isWeb: !isTauri };
};