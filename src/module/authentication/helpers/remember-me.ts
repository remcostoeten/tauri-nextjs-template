'use client';

const REMEMBER_ME_KEY = 'remember_me_credentials';

export interface RememberMeCredentials {
    email: string;
    rememberMe: boolean;
}

/**
 * Save credentials for remember me functionality
 * Uses Tauri's secure storage on desktop, localStorage on web
 */
export async function saveRememberMeCredentials(credentials: RememberMeCredentials): Promise<void> {
    try {
        // Check if we're in Tauri environment
        const { isTauri } = await import('@tauri-apps/api/core');

        if (isTauri()) {
            // Use Tauri's secure storage
            const { Store } = await import('@tauri-apps/plugin-store');
            const store = new Store('credentials.dat');

            if (credentials.rememberMe) {
                await store.set(REMEMBER_ME_KEY, {
                    email: credentials.email,
                    timestamp: Date.now()
                });
                await store.save();
            } else {
                await store.delete(REMEMBER_ME_KEY);
                await store.save();
            }
        } else {
            // Use localStorage for web
            if (credentials.rememberMe) {
                localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify({
                    email: credentials.email,
                    timestamp: Date.now()
                }));
            } else {
                localStorage.removeItem(REMEMBER_ME_KEY);
            }
        }
    } catch (error) {
        console.error('Failed to save remember me credentials:', error);
        // Fallback to localStorage
        if (credentials.rememberMe) {
            localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify({
                email: credentials.email,
                timestamp: Date.now()
            }));
        } else {
            localStorage.removeItem(REMEMBER_ME_KEY);
        }
    }
}

/**
 * Load saved credentials for remember me functionality
 * Returns null if no credentials are saved or if they're expired
 */
export async function loadRememberMeCredentials(): Promise<{ email: string } | null> {
    try {
        // Check if we're in Tauri environment
        const { isTauri } = await import('@tauri-apps/api/core');

        if (isTauri()) {
            // Use Tauri's secure storage
            const { Store } = await import('@tauri-apps/plugin-store');
            const store = new Store('credentials.dat');

            const saved = await store.get<{ email: string; timestamp: number }>(REMEMBER_ME_KEY);

            if (saved && isCredentialsValid(saved.timestamp)) {
                return { email: saved.email };
            }

            // Clean up expired credentials
            if (saved) {
                await store.delete(REMEMBER_ME_KEY);
                await store.save();
            }

            return null;
        } else {
            // Use localStorage for web
            const saved = localStorage.getItem(REMEMBER_ME_KEY);

            if (saved) {
                const parsed = JSON.parse(saved) as { email: string; timestamp: number };

                if (isCredentialsValid(parsed.timestamp)) {
                    return { email: parsed.email };
                }

                // Clean up expired credentials
                localStorage.removeItem(REMEMBER_ME_KEY);
            }

            return null;
        }
    } catch (error) {
        console.error('Failed to load remember me credentials:', error);

        // Fallback to localStorage
        try {
            const saved = localStorage.getItem(REMEMBER_ME_KEY);

            if (saved) {
                const parsed = JSON.parse(saved) as { email: string; timestamp: number };

                if (isCredentialsValid(parsed.timestamp)) {
                    return { email: parsed.email };
                }

                localStorage.removeItem(REMEMBER_ME_KEY);
            }
        } catch (fallbackError) {
            console.error('Fallback localStorage also failed:', fallbackError);
        }

        return null;
    }
}

/**
 * Clear saved remember me credentials
 */
export async function clearRememberMeCredentials(): Promise<void> {
    try {
        // Check if we're in Tauri environment
        const { isTauri } = await import('@tauri-apps/api/core');

        if (isTauri()) {
            // Use Tauri's secure storage
            const { Store } = await import('@tauri-apps/plugin-store');
            const store = new Store('credentials.dat');

            await store.delete(REMEMBER_ME_KEY);
            await store.save();
        } else {
            // Use localStorage for web
            localStorage.removeItem(REMEMBER_ME_KEY);
        }
    } catch (error) {
        console.error('Failed to clear remember me credentials:', error);
        // Fallback to localStorage
        localStorage.removeItem(REMEMBER_ME_KEY);
    }
}

/**
 * Check if saved credentials are still valid (not expired)
 * Credentials expire after 30 days
 */
function isCredentialsValid(timestamp: number): boolean {
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    return Date.now() - timestamp < THIRTY_DAYS;
}

/**
 * Hook for using remember me functionality in React components
 */
export function useRememberMe() {
    return {
        saveCredentials: saveRememberMeCredentials,
        loadCredentials: loadRememberMeCredentials,
        clearCredentials: clearRememberMeCredentials
    };
}
