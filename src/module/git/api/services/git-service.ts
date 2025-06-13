/**
 *  @author Remco Stoeten
 *  @description Pure functional GitHub API service with caching and version calculation.
 */

import { TCommit, TGitHubResponse, TAppVersion, TGitCache } from '@/typings/git'
import { noop } from '@/shared/helpers/noop'

const GITHUB_API_BASE = 'https://api.github.com'
const REPO_OWNER = 'remcostoeten'
const REPO_NAME = 'tauri-nextjs-template'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes
const CACHE_KEY = 'github-commits-cache'

let cache: TGitCache | null = null

export function getCachedData(): TGitCache | null {
    if (cache !== null) {
        const isStale = Date.now() - cache.timestamp > CACHE_DURATION
        return { ...cache, is_stale: isStale }
    }
    if (typeof window !== 'undefined') {
        try {
            const cachedString = localStorage.getItem(CACHE_KEY)
            if (cachedString) {
                const parsed = JSON.parse(cachedString) as TGitCache
                const isStale = Date.now() - parsed.timestamp > CACHE_DURATION
                return { ...parsed, is_stale: isStale }
            }
        } catch (error: unknown) {
            noop()
        }
    }
    return null
}

export function setCachedData(data: TGitHubResponse): void {
    const cacheData: TGitCache = {
        data,
        timestamp: Date.now(),
        is_stale: false
    }
    cache = cacheData
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        } catch (error: unknown) {
            noop()
        }
    }
}

export function clearCache(): void {
    cache = null
    if (typeof window !== 'undefined') {
        try {
            localStorage.removeItem(CACHE_KEY)
        } catch (error: unknown) {
            noop()
        }
    }
}

export function fetchCommits(limit: number): Promise<TGitHubResponse> {
    return new Promise((resolve, reject) => {
        const cachedData = getCachedData()
        if (cachedData !== null && !cachedData.is_stale) {
            resolve(cachedData.data)
            return
        }
        fetch(
            `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=master&per_page=${limit}`,
            {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    'User-Agent': 'AgentPlan-App'
                }
            }
        )
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 403 && cachedData !== null) {
                        // rate limited, return stale data
                        resolve({ ...cachedData.data, is_stale: true })
                        return
                    }
                    throw new Error(`GitHub API error: ${response.status}`)
                }
                return response.json() as Promise<TCommit[]>
            })
            .then((commits) => {
                if (!commits) {
                    throw new Error('No commits received')
                }
                const result: TGitHubResponse = {
                    commits,
                    total_count: commits.length
                }
                setCachedData(result)
                resolve(result)
            })
            .catch((error: unknown) => {
                const cachedDataInner = getCachedData()
                if (cachedDataInner !== null) {
                    resolve({ ...cachedDataInner.data, is_stale: true })
                    return
                }
                reject(error instanceof Error ? error : new Error('Unknown error'))
            })
    })
}

export function fetchLatestCommit(): Promise<TCommit | null> {
    return fetchCommits(1)
        .then((response) => response.commits[0] || null)
        .catch((error: unknown) => {
            // swallow error, log and return null
            console.error('Failed to fetch latest commit:', error)
            return null
        })
}

export function fetchTotalCommitCount(): Promise<number> {
    return new Promise((resolve) => {
        fetch(
            `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=master&per_page=1`,
            {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    'User-Agent': 'AgentPlan-App'
                }
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`)
                }
                const linkHeader = response.headers.get('link')
                if (linkHeader) {
                    const match = /page=(\d+)>; rel="last"/.exec(linkHeader)
                    if (match?.[1]) {
                        resolve(parseInt(match[1], 10))
                        return
                    }
                }
                // fallback to count commits inefficiently
                return fetchCommits(100).then((allCommits) => {
                    resolve(allCommits.commits.length)
                })
            })
            .catch((error: unknown) => {
                console.error('Failed to get commit count:', error)
                resolve(0)
            })
    })
}

export function calculateVersion(commitCount: number): TAppVersion {
    const totalCommits = commitCount
    const major = Math.floor(totalCommits / 100)
    const minor = Math.floor((totalCommits % 100) / 10) + 1
    const patch = totalCommits % 10
    return {
        major,
        minor,
        patch,
        display: `${major}.${minor}.${patch}`
    }
}
