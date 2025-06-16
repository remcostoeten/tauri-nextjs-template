import { useTheme } from '@/styles/themes/theme-provider';
import { Button } from './ui/button';
import { Moon, Sun, Palette } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function ThemeSwitcher() {
    const { theme, setTheme, colorScheme, setColorScheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    {colorScheme === 'dark' ? (
                        <Moon className="h-5 w-5" />
                    ) : (
                        <Sun className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setColorScheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorScheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('clay')}>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Clay Theme</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('solar-dusk')}>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Solar Dusk</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 