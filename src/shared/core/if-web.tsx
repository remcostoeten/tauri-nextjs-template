/**
 * @description Component that renders its children only when running in web browser
 * @author Remco Stoeten
 */

'use client'

import React from 'react';
import { usePlatform } from '../hooks/use-platform';


export function IfWeb({ children }: { children: React.ReactNode }) {
  const { isWeb } = usePlatform();

  if (isWeb) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return null;
};