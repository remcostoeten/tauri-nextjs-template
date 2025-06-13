'use client'

/**
 *  @description Updates system tray menu with current app version
 */

import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useGitData } from './use-git-data'
import { noop } from '@/shared/helpers/noop'

export function useSystemTray(): void {
    const { version } = useGitData()

    useEffect(() => {
        function updateVersion(): void {
            void invoke('update_tray_version', {
                version: version.display
            }).catch(noop)
        }

        if (typeof window !== 'undefined' && '__TAURI__' in window) {
            updateVersion()
        }
    }, [version.display])
} 