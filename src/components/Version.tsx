import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';

export function Version() {
    const [version, setVersion] = useState<string>('0.00');

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const currentVersion = await invoke('get_current_version');
                setVersion(currentVersion as string);
            } catch (error) {
                console.error('Failed to fetch version:', error);
            }
        };

        fetchVersion();
    }, []);

    return (
        <div className="version-display">
            <span>v{version}</span>
        </div>
    );
} 