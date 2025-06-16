'use client'

import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import { IfTauri } from '../shared/core/if-tauri'
import { IfWeb } from '../shared/core/if-web'

export function ProjectName() {
    const [projectName, setProjectName] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProjectName = async () => {
            try {
                if (typeof invoke !== 'function') {
                    throw new Error('Tauri API not loaded')
                }

                const name = await invoke('get_project_name')
                setProjectName(name as string)
            } catch (error) {
                console.error('Failed to fetch project name:', error)
                setError(error instanceof Error ? error.message : 'Unknown error')
                setProjectName('Error')
            }
        }

        fetchProjectName()
    }, [])

    if (error) {
        return <div className="text-sm text-red-500">Error: {error}</div>
    }

    return (
        <>
            <IfTauri>
                {projectName && (
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{projectName}</span>
                    </div>
                )}
            </IfTauri>
            <IfWeb>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">Development Mode</span>
                </div>
            </IfWeb>
        </>
    )
} 