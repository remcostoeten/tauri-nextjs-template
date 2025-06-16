import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Theme, type ColorScheme } from './types';
import { clayTheme } from './clay';
import { solarDuskTheme } from './solar-dusk';

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme['name']) => void;
    colorScheme: ColorScheme;
    setColorScheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: Record<Theme['name'], Theme> = {
    clay: clayTheme,
    'solar-dusk': solarDuskTheme,
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeName, setThemeName] = useState<Theme['name']>('solar-dusk');
    const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

    const theme = themes[themeName];

    useEffect(() => {
        // Apply theme variables to document root
        const root = document.documentElement;
        const colors = theme.colors[colorScheme];

        // Apply colors
        Object.entries(colors).forEach(([key, value]) => {
            if (typeof value === 'string') {
                root.style.setProperty(`--${key}`, value);
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    root.style.setProperty(`--${key}-${subKey}`, subValue);
                });
            }
        });

        // Apply other theme properties
        Object.entries(theme.fonts).forEach(([key, value]) => {
            root.style.setProperty(`--font-${key}`, value);
        });

        Object.entries(theme.radii).forEach(([key, value]) => {
            root.style.setProperty(`--radius-${key}`, value);
        });

        Object.entries(theme.shadows).forEach(([key, value]) => {
            root.style.setProperty(`--shadow-${key}`, value);
        });

        // Update color scheme class
        root.classList.remove('light', 'dark');
        root.classList.add(colorScheme);
    }, [theme, colorScheme]);

    const value = {
        theme,
        setTheme: setThemeName,
        colorScheme,
        setColorScheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
} 