/**
 * @description Component that renders its children only when running in Tauri(desktop app)
 * @author Remco Stoeten
 */

'use client'

import { usePlatform } from '../hooks/use-platform';

export function IfTauri({ children }: { children: React.ReactNode }) {
  const { isTauri } = usePlatform();

  if (isTauri) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return null;
};