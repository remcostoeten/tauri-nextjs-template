'use client'

/**
 *  @description Updates system tray menu with current app version
 */

import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { noop } from '@/shared/helpers'
import { useAppFooterData } from './use-git-data'

export function useSystemTray(): void {
    const { version } = useAppFooterData()

    useEffect(() => {
        function updateVersion(): void {
            void invoke('update_tray_version', {
                version: version
            }).catch(noop)
        }

        if (typeof window !== 'undefined' && '__TAURI__' in window) {
            updateVersion()
        }
        arguments
    }, [version])
} 