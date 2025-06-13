'use client'

/**
 *  @author Remco Stoeten
 *  @description React hook fetching git data with loading, error, and stale states.
 */

import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'

type TGitData = {
    latest_commit: {
        sha: string
        commit: {
            message: string
        }
    } | null
    recent_commits: Array<{
        sha: string
        commit: {
            message: string
        }
    }>
    version: {
        display: string
    }
    is_loading: boolean
    is_error: boolean
    is_stale: boolean
    is_desktop: boolean
}

export function useGitData(): TGitData {
    const [data, setData] = useState<TGitData>({
        latest_commit: null,
        recent_commits: [],
        version: { display: '0.1.0' },
        is_loading: true,
        is_error: false,
        is_stale: false,
        is_desktop: typeof window !== 'undefined' && '__TAURI__' in window
    })

    useEffect(() => {
        let mounted = true

        async function fetchData() {
            try {
                const [commits, version] = await Promise.all([
                    data.is_desktop ? invoke<TGitData['recent_commits']>('get_recent_commits') : Promise.resolve([]),
                    data.is_desktop ? invoke<string>('get_current_version') : Promise.resolve('0.1.0')
                ])

                if (!mounted) return

                setData(prev => ({
                    ...prev,
                    latest_commit: commits[0] || null,
                    recent_commits: commits,
                    version: { display: version },
                    is_loading: false,
                    is_error: false
                }))
            } catch (error) {
                console.error('Failed to fetch git data:', error)
                if (!mounted) return
                setData(prev => ({
                    ...prev,
                    is_loading: false,
                    is_error: true
                }))
            }
        }

        void fetchData()

        return () => {
            mounted = false
        }
    }, [data.is_desktop])

    return data
}
