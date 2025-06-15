import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { usePlatform } from '@/shared/hooks/use-platform'
import { noop } from '@/shared/helpers'

type TGitHubCommit = {
    sha: string
    commit: {
        message: string
        author: {
            name: string
            email: string
            date: string
        }
    }
    author: {
        login: string
        avatar_url: string
    } | null
}

type TAppFooterData = {
    version: string
    latest_commit?: TGitHubCommit
    recent_commits: TGitHubCommit[]
    is_loading: boolean
    is_error: boolean
    is_stale: boolean
    is_desktop: boolean
}

const CACHE_KEY = 'app_footer_commits'
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes
const GITHUB_API_BASE = 'https://api.github.com'
const REPO_OWNER = 'remcostoeten'
const REPO_NAME = 'tauri-nextjs-template'
const BRANCH = 'master'

export function useAppFooterData(): TAppFooterData {
    const { isTauri } = usePlatform()
    const [data, setData] = useState<TAppFooterData>({
        version: '0.00',
        latest_commit: undefined,
        recent_commits: [],
        is_loading: true,
        is_error: false,
        is_stale: false,
        is_desktop: isTauri
    })

    const isCacheValid = (timestamp: number): boolean => {
        return Date.now() - timestamp < CACHE_EXPIRY
    }

    const getCachedCommits = (): { commits: TGitHubCommit[]; timestamp: number } | null => {
        if (typeof window === 'undefined') return null

        try {
            const cached = localStorage.getItem(CACHE_KEY)
            if (!cached) return null

            return JSON.parse(cached)
        } catch {
            return null
        }
    }

    const setCachedCommits = (commits: TGitHubCommit[]): void => {
        if (typeof window === 'undefined') return

        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                commits,
                timestamp: Date.now()
            }))
        } catch {
            noop()
        }
    }

    const fetchVersion = async (): Promise<string> => {
        if (isTauri) {
            try {
                const version = await invoke('get_current_version') as string
                return version
            } catch (error) {
                console.error('Failed to fetch version from Tauri:', error)
            }
        }

        return process.env.NEXT_PUBLIC_APP_VERSION ||
            process.env.npm_package_version ||
            '1.0.0'
    }

    const fetchCommits = async (): Promise<TGitHubCommit[]> => {
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=${BRANCH}&per_page=10`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
                        'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
                    })
                }
            }
        )

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`)
        }

        return response.json()
    }

    const fetchData = async (): Promise<void> => {
        try {
            setData(prev => ({ ...prev, is_loading: true, is_error: false }))

            const version = await fetchVersion()

            const cached = getCachedCommits()
            if (cached && isCacheValid(cached.timestamp)) {
                setData({
                    version,
                    latest_commit: cached.commits[0] ?? undefined,
                    recent_commits: cached.commits,
                    is_loading: false,
                    is_error: false,
                    is_stale: true,
                    is_desktop: isTauri
                })
                return
            }

            const commits = await fetchCommits()
            const latest_commit = commits[0] ?? undefined

            setCachedCommits(commits)

            setData({
                version,
                latest_commit,
                recent_commits: commits,
                is_loading: false,
                is_error: false,
                is_stale: false,
                is_desktop: isTauri
            })
        } catch (error) {
            console.error('Failed to fetch app footer data:', error)

            const cached = getCachedCommits()
            const version = await fetchVersion().catch(() => '0.00')

            if (cached) {
                setData({
                    version,
                    latest_commit: cached.commits[0] ?? undefined,
                    recent_commits: cached.commits,
                    is_loading: false,
                    is_error: false,
                    is_stale: true,
                    is_desktop: isTauri
                })
            } else {
                setData({
                    version,
                    latest_commit: undefined,
                    recent_commits: [],
                    is_loading: false,
                    is_error: true,
                    is_stale: false,
                    is_desktop: isTauri
                })
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [isTauri])

    useEffect(() => {
        const handleFocus = () => {
            const cached = getCachedCommits()
            if (!cached || !isCacheValid(cached.timestamp)) {
                fetchData()
            }
        }

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                handleFocus()
            }
        }

        window.addEventListener('focus', handleFocus)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            window.removeEventListener('focus', handleFocus)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    return data
}
