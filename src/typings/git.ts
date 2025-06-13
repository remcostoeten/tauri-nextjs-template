/**
 *  @author Remco Stoeten
 *  @description Type definitions for GitHub commits and related data
 */

export type TCommitAuthor = {
    name: string
    email: string
    date: string
}

export type TCommit = {
    sha: string
    message: string
    author: TCommitAuthor
    html_url: string
    commit: {
        author: TCommitAuthor
        message: string
    }
}

export type TGitHubResponse = {
    commits: TCommit[]
    total_count: number
    is_stale?: boolean
}

export type TAppVersion = {
    major: number
    minor: number
    patch: number
    display: string
}

export type TGitCache = {
    data: TGitHubResponse
    timestamp: number
    is_stale: boolean
}

export type TGitData = {
    latest_commit: TCommit | null
    recent_commits: TCommit[]
    version: TAppVersion
    is_loading: boolean
    is_error: boolean
    is_stale: boolean
}
