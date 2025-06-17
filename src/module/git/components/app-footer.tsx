"use client"
// 
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, GitCommit, Clock, Monitor, Globe, ExternalLink, ChevronsUp } from 'lucide-react'
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

import { useAppFooterData } from '@/module/git/hooks'

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

export function AppFooter({ autoHide = true }: { autoHide?: boolean }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isAutoHidden, setIsAutoHidden] = useState(autoHide)
    const [appName, setAppName] = useState('')
    const {
        version,
        projectName,
        latest_commit,
        recent_commits,
        is_loading,
        is_error,
        is_stale,
        is_desktop
    } = useAppFooterData();

    useEffect(() => {
        const fetchAppName = async () => {
            if (is_desktop) {
                try {
                    const { getName } = await import("@tauri-apps/plugin-app");
                    const name = await getName();
                    setAppName(name);
                } catch (error) {
                    console.error('Failed to get app name:', error);
                    setAppName(projectName || 'Skibidado');
                }
            } else {
                setAppName(projectName || 'Skibidado');
            }
        };

        fetchAppName();
    }, [is_desktop, projectName]);

    useEffect(() => {
        setIsAutoHidden(autoHide);
    }, [autoHide]);

    if (is_error) {
        return null
    }

    const displayCommit = latest_commit || (recent_commits.length > 0 ? recent_commits[0] : null)

    const handleToggleFooter = () => {
        setIsAutoHidden(!isAutoHidden);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div
                className={`absolute bottom-full left-4 right-4 md:left-8 md:right-auto md:max-w-md transform transition-all duration-300 ease-out ${isHovered && recent_commits.length > 0 && !isAutoHidden
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : 'translate-y-2 opacity-0 pointer-events-none'
                    }`}
            >
                <Card className="mb-2 shadow-xl border-2">
                    <div className="absolute bottom-0 left-8 transform translate-y-full">
                        <div className="w-3 h-3 bg-background border-r border-b border-border transform rotate-45"></div>
                    </div>
                    <CardContent className="p-0">
                        <CommitTree commits={recent_commits} is_stale={is_stale} />
                    </CardContent>
                </Card>
            </div>

            <motion.footer
                className="bg-background/95 backdrop-blur-sm border-t shadow-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                animate={{
                    y: isAutoHidden ? '100%' : '0%'
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.3
                }}
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="flex items-center gap-2">
                                <GitCommit className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-foreground hidden sm:inline">{appName}</span>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3">
                                <Badge variant="outline" className="text-xs">
                                    v{version}
                                </Badge>

                                <Badge variant={is_desktop ? "default" : "secondary"} className="text-xs flex items-center">
                                    {is_desktop ? (
                                        <>
                                            <Monitor className="w-3 h-3 mr-1" />
                                            <span>Desktop</span>
                                        </>
                                    ) : (
                                        <>
                                            <Globe className="w-3 h-3 mr-1" />
                                            <span>Web</span>
                                        </>
                                    )}
                                </Badge>

                                {process.env.NODE_ENV === 'development' && (
                                    !is_loading ? (
                                        <motion.div
                                            initial={{ opacity: 100 }}
                                            animate={{ opacity: 0 }}
                                            transition={{ duration: 2, delay: 5 }}
                                        >
                                            <Badge variant="secondary" className="text-xs">
                                                {is_error ? 'Error' : 'Loaded'}
                                            </Badge>
                                        </motion.div>
                                    ) : (
                                        <div>
                                            <Badge variant="secondary" className="text-xs">
                                                Loading...
                                            </Badge>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

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
            </motion.footer>

            <AnimatePresence>
                {autoHide && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 100, damping: 10 }}
                        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer"
                        onClick={handleToggleFooter}
                        onMouseEnter={handleToggleFooter}
                    >
                        <motion.div
                            animate={{ rotate: isAutoHidden ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-t-md px-2 py-1 shadow-sm hover:bg-background transition-all"
                        >
                            <ChevronsUp className="w-3 h-3" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
