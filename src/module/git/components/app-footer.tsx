/**
 *  @description Footer component showing current app version and latest commit preview.
 */

'use client'

import { useState } from 'react'
import { CommitTree } from './commit-tree'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/helpers/cn'

export function AppFooter(): React.ReactElement | null {
    const [isHovered, setIsHovered] = useState(false)


    if (is_error) {
        return null
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {isHovered && (
                <div className="bg-white border-t border-gray-200 shadow-lg">
                    <CommitTree commits={recent_commits} is_stale={is_stale} />
                </div>
            )}
            <footer
                className={cn(
                    'bg-gray-900 text-white px-4 py-2 text-sm',
                    'transition-all duration-200'
                )}
                onMouseEnter={() => {
                    setIsHovered(true)
                }}
                onMouseLeave={() => {
                    setIsHovered(false)
                }}
            >
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <span className="font-medium">Agent Plan</span>
                        <span className="text-gray-400">v{version.display}</span>
                        <span className="ml-2 px-2 py-1 rounded bg-gray-800 text-xs">
                            {is_desktop ? 'Desktop' : 'Web'}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {is_loading ? (
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ) : latest_commit ? (
                            <>
                                <span className="text-gray-400 truncate max-w-[200px]">
                                    {latest_commit.commit.message.split('\n')[0]}
                                </span>
                                <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                                    {latest_commit.sha.substring(0, 7)}
                                </code>
                                {is_stale && process.env.NODE_ENV === 'development' && (
                                    <span className="text-xs text-yellow-400 bg-yellow-900 px-2 py-1 rounded">
                                        CACHED
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-gray-400">No commits available</span>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    )
}
