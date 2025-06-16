export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    chart: {
        [key: number]: string;
    };
    sidebar: {
        background: string;
        foreground: string;
        primary: string;
        primaryForeground: string;
        accent: string;
        accentForeground: string;
        border: string;
        ring: string;
    };
};

export type ThemeConfig = {
    fonts: {
        sans: string;
        serif: string;
        mono: string;
    };
    radii: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    shadows: {
        '2xs': string;
        xs: string;
        sm: string;
        base: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
    };
};

export type Theme = {
    name: string;
    colors: {
        light: ThemeColors;
        dark: ThemeColors;
    };
} & ThemeConfig; 