/**
 *  @description Animated list of recent git commits
 */

'use client'

import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/shared/helpers/cn'

type Commit = {
    sha: string
    commit: {
        message: string
    }
}

type CommitTreeProps = {
    commits: Commit[]
    is_stale: boolean
}

export function CommitTree({ commits, is_stale }: CommitTreeProps): React.ReactElement {
    return (
        <div className="p-4 max-h-[300px] overflow-y-auto">
            <div className="space-y-2">
                {commits.map((commit, index) => (
                    <div
                        key={commit.sha}
                        className={cn(
                            'flex items-start space-x-3 p-2 rounded',
                            'hover:bg-gray-100 transition-colors'
                        )}
                    >
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-gray-400" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">
                                {commit.commit.message.split('\n')[0]}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <code className="font-mono">{commit.sha.substring(0, 7)}</code>
                                {is_stale && (
                                    <span className="text-yellow-600">(cached)</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
