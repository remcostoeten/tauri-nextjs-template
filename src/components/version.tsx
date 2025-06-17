'use client'

import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { IfTauri } from '../shared/core/if-tauri';
import { IfWeb } from '../shared/core/if-web';

export function Version() {
    const [version, setVersion] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                if (typeof window !== 'undefined' && '__TAURI__' in window) {
                    if (typeof invoke !== 'function') {
                        throw new Error('Tauri API not loaded');
                    }
                    const currentVersion = await invoke('get_current_version');
                    setVersion(currentVersion as string);
                }
            } catch (error) {
                console.error('Failed to fetch version:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
                setVersion('Error');
            }
        };

        fetchVersion();
    }, []);

    if (error) {
        return <div className="text-sm text-red-500">Error: {error}</div>;
    }

    return (
        <>
            <IfTauri>
                {version && (
                    <div className="text-sm text-muted-foreground">v{version}</div>
                )}
            </IfTauri>
            <IfWeb>
                <div className="text-sm text-muted-foreground">v0.0.8</div>
            </IfWeb>
        </>
    );
} 