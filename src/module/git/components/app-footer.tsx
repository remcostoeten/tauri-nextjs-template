import { useState } from 'react'
import { GitBranch, GitCommit, Clock, Monitor, Globe } from 'lucide-react'

interface Commit {
    sha: string
    commit: {
        message: string
        author: {
            name: string
            date: string
        }
    }
}

interface AppFooterProps {
    version?: string
    latest_commit?: Commit
    recent_commits?: Commit[]
    is_loading?: boolean
    is_error?: boolean
    is_stale?: boolean
    is_desktop?: boolean
}

function CommitTree({ commits, is_stale }: { commits?: Commit[], is_stale?: boolean }) {
    if (!commits || commits.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No recent commits available
            </div>
        )
    }

    return (
        <div className="p-4 max-h-80 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <GitBranch className="w-4 h-4 text-neutral-300" />
                <span className="font-medium text-neutral-400">Recent Commits</span>
                {is_stale && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                        Cached
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {commits.map((commit, index) => (
                    <div key={commit.sha} className="flex items-start gap-3 group">
                        <div className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-neutral-400 shimmer rounded-full mt-2" />
                            {index < commits.length - 1 && (
                                <div className="w-0.5 h-8 bg-border mt-1" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <code className="text-xs bg-background/50 shimmer  shimmer-20 border border-border text-neutral-400 px-2 py-1 rounded font-mono">
                                    {commit.sha.substring(0, 7)}
                                </code>
                                <span className="text-xs text-foreground">
                                    {new Date(commit.commit.author.date).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-sm text-neutral-300  leading-relaxed mb-1">
                                {commit.commit.message.split('\n')[0]}
                            </p>

                            <div className="flex items-center gap-1 text-xs text-neutral-400">
                                <span>{commit.commit.author.name}</span>
                                <Clock className="w-3 h-3" />
                                <span>{new Date(commit.commit.author.date).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Skeleton({ className }: { className: string }) {
    return (
        <div className={`animate-pulse bg-background/50 rounded ${className}`} />
    )
}

export function AppFooter({
    version = '1.0.0',
    latest_commit,
    recent_commits = [], // Changed from mockCommits to empty array
    is_loading = false,
    is_error = false,
    is_stale = false,
    is_desktop = true
}: AppFooterProps) {
    const [isHovered, setIsHovered] = useState(false)

    if (is_error) {
        return null
    }

    // Use the latest commit from recent_commits if latest_commit is not provided
    const displayCommit = latest_commit || (recent_commits.length > 0 ? recent_commits[0] : null)

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div
                className={`absolute bottom-full left-0 right-0 transform transition-all duration-300 ease-out ${isHovered
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : 'translate-y-2 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="mx-4 mb-2">
                    <div className="bg-background rounded-lg shadow-2xl border border-border backdrop-blur-sm">
                        {/* Popover arrow */}
                        <div className="absolute bottom-0 left-8 transform translate-y-full">
                            <div className="w-3 h-3 bg-background border-r border-b border-border transform rotate-45"></div>
                        </div>

                        <CommitTree commits={recent_commits} is_stale={is_stale} />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer
                className="bg-background text-foreground px-6 py-3 shadow-lg border-t border-border"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center justify-between max-w-full">
                    {/* Left side - App info */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-2">
                            <GitCommit className="w-4 h-4 text-foreground" />
                            <span className="font-semibold text-slate-300">Agent Plan</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-slate-300 text-sm">v{version}</span>

                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/50 border border-border">
                                {is_desktop ? (
                                    <>
                                        <Monitor className="w-3 h-3 text-blue-400" />
                                        <span className="text-xs text-slate-300">Desktop</span>
                                    </>
                                ) : (
                                    <>
                                        <Globe className="w-3 h-3 text-green-400" />
                                        <span className="text-xs text-slate-300">Web</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 min-w-0">
                        {is_loading ? (
                            <div className="flex items-center space-x-3">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ) : displayCommit ? (
                            <div className="flex items-center space-x-3 min-w-0">
                                <div className="flex items-center gap-2 text-sm text-slate-300 truncate max-w-xs">
                                    <GitCommit className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">
                                        {displayCommit.commit.message.split('\n')[0]}
                                    </span>
                                </div>

                                <code className="text-xs bg-slate-800 text-blue-300 px-2 py-1 rounded border border-slate-600 font-mono">
                                    {displayCommit.sha.substring(0, 7)}
                                </code>

                                {is_stale && (
                                    <span className="text-xs text-amber-300 bg-amber-900/50 px-2 py-1 rounded border border-amber-700">
                                        CACHED
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-slate-400 text-sm">No commits available</span>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    )
}