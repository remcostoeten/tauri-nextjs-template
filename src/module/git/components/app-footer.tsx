"use client"

import { useState } from 'react'
import { GitBranch, GitCommit, Clock, Monitor, Globe, ExternalLink } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Skeleton } from '@/shared/ui/skeleton'
import { Card, CardContent } from '@/shared/ui/card'

type TCommit = {
    sha: string
    commit: {
        message: string
        link?: string
        author: {
            name: string
            date: string
        }
    }
}

function CommitTree({ commits, is_stale }: { commits?: TCommit[], is_stale?: boolean }) {
    if (!commits || commits.length === 0) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent commits available</p>
            </div>
        )
    }

    return (
        <div className="p-4 max-h-80 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <GitBranch className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">Recent Commits</span>
                {is_stale && (
                    <Badge variant="secondary" className="text-xs">
                        Cached
                    </Badge>
                )}
            </div>

            <div className="space-y-4">
                {commits.map((commit, index) => (
                    <div key={commit.sha} className="flex items-start gap-3 group hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors">
                        <div className="flex flex-col items-center pt-1">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            {index < commits.length - 1 && (
                                <div className="w-0.5 h-8 bg-border mt-2" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                    {commit.sha.substring(0, 7)}
                                </Badge>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                                    {commit.commit.link && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-muted-foreground hover:text-foreground"
                                            asChild
                                        >
                                            <a href={commit.commit.link} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-foreground leading-relaxed">
                                {commit.commit.message.split('\n')[0]}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-medium">{commit.commit.author.name}</span>
                                <Clock className="w-3 h-3" />
                                <span>{new Date(commit.commit.author.date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

type TProps = {
    version?: string
    latest_commit?: TCommit
    recent_commits?: TCommit[]
    is_loading?: boolean
    is_error?: boolean
    is_stale?: boolean
    is_desktop?: boolean
}

export function AppFooter({
    version = '1.0.0',
    latest_commit,
    recent_commits = [],
    is_loading = false,
    is_error = false,
    is_stale = false,
    is_desktop = true
}: TProps) {
    const [isHovered, setIsHovered] = useState(false)

    if (is_error) {
        return null
    }

    const displayCommit = latest_commit || (recent_commits.length > 0 ? recent_commits[0] : null)

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Hover popup */}
            <div
                className={`absolute bottom-full left-4 right-4 md:left-8 md:right-auto md:max-w-md transform transition-all duration-300 ease-out ${isHovered && recent_commits.length > 0
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : 'translate-y-2 opacity-0 pointer-events-none'
                    }`}
            >
                <Card className="mb-2 shadow-xl border-2">
                    <div className="absolute bottom-0 left-8 transform translate-y-full">
                        <div className="w-3 h-3 bg-background border-r border-b border-foreground AAA transform rotate-45"></div>
                    </div>
                    <CardContent className="p-0">
                        <CommitTree commits={recent_commits} is_stale={is_stale} />
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <footer
                className="bg-background/95 backdrop-blur-sm border-t shadow-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="px-4 py-3 md:px-6">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left side - App info */}
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="flex items-center gap-2">
                                <GitCommit className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-foreground hidden sm:inline">Agent Plan</span>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3">
                                <Badge variant="outline" className="text-xs">
                                    v{version}
                                </Badge>

                                <Badge variant={is_desktop ? "default" : "secondary"} className="text-xs">
                                    {is_desktop ? (
                                        <>
                                            <Monitor className="w-3 h-3 mr-1" />
                                            Desktop
                                        </>
                                    ) : (
                                        <>
                                            <Globe className="w-3 h-3 mr-1" />
                                            Web
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </div>

                        {/* Right side - Commit info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
                            {is_loading ? (
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ) : displayCommit ? (
                                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                                        <GitCommit className="w-3 h-3 flex-shrink-0 hidden sm:block" />
                                        <span className="truncate max-w-[150px] md:max-w-[300px]">
                                            {displayCommit.commit.message.split('\n')[0]}
                                        </span>
                                    </div>

                                    <Badge variant="outline" className="text-xs font-mono flex-shrink-0">
                                        {displayCommit.sha.substring(0, 7)}
                                    </Badge>

                                    {is_stale && (
                                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                                            CACHED
                                        </Badge>
                                    )}
                                </div>
                            ) : (
                                <span className="text-muted-foreground text-sm">No commits available</span>
                            )}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Demo component with sample data
export default function AppFooterDemo() {
    const sampleCommits: TCommit[] = [
        {
            sha: "a1b2c3d4e5f6",
            commit: {
                message: "feat: add new dashboard components with improved styling",
                link: "https://github.com/example/repo/commit/a1b2c3d4e5f6",
                author: {
                    name: "John Doe",
                    date: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
                }
            }
        },
        {
            sha: "b2c3d4e5f6g7",
            commit: {
                message: "fix: resolve authentication issues in login flow",
                link: "https://github.com/example/repo/commit/b2c3d4e5f6g7",
                author: {
                    name: "Jane Smith",
                    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
                }
            }
        },
        {
            sha: "c3d4e5f6g7h8",
            commit: {
                message: "docs: update README with installation instructions",
                author: {
                    name: "Bob Johnson",
                    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
                }
            }
        },
        {
            sha: "d4e5f6g7h8i9",
            commit: {
                message: "refactor: optimize database queries for better performance",
                link: "https://github.com/example/repo/commit/d4e5f6g7h8i9",
                author: {
                    name: "Alice Brown",
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
                }
            }
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-20">
            <div className="container mx-auto p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">App Footer Demo</h1>
                    <p className="text-muted-foreground mb-8">
                        Hover over the footer at the bottom to see the commit history popup.
                    </p>

                    <div className="space-y-4">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-2">Features</h2>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Hover to reveal commit history</li>
                                    <li>• Responsive design for mobile and desktop</li>
                                    <li>• Loading states and error handling</li>
                                    <li>• External link support for commits</li>
                                    <li>• Cached data indicators</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
