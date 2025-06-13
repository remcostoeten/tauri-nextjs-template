export type TCommit = {
    sha: string
    node_id: string
    commit: {
        author: {
            name: string
            email: string
            date: string
        }
        committer: {
            name: string
            email: string
            date: string
        }
        message: string
        tree: {
            sha: string
            url: string
        }
        url: string
        comment_count: number
        verification: {
            verified: boolean
            reason: string
            signature: string | null
            payload: string | null
        }
    }
    url: string
    html_url: string
    comments_url: string
    author: {
        login: string
        id: number
        node_id: string
        avatar_url: string
        gravatar_id: string
        url: string
        html_url: string
        followers_url: string
        following_url: string
        gists_url: string
        starred_url: string
        subscriptions_url: string
        organizations_url: string
        repos_url: string
        events_url: string
        received_events_url: string
        type: string
        site_admin: boolean
    } | null
    committer: {
        login: string
        id: number
        node_id: string
        avatar_url: string
        gravatar_id: string
        url: string
        html_url: string
        followers_url: string
        following_url: string
        gists_url: string
        starred_url: string
        subscriptions_url: string
        organizations_url: string
        repos_url: string
        events_url: string
        received_events_url: string
        type: string
        site_admin: boolean
    } | null
    parents: Array<{
        sha: string
        url: string
        html_url: string
    }>
}

export type TGitHubResponse = {
    commits: TCommit[]
    total_count: number
    is_stale?: boolean
}

export type TGitCache = {
    data: TGitHubResponse
    timestamp: number
    is_stale: boolean
}

export type TAppVersion = {
    major: number
    minor: number
    patch: number
    display: string
} 