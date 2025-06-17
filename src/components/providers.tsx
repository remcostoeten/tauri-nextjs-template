import {  TooltipProvider } from '@/shared/ui/'
import { SidebarProvider } from '@/shared/ui/sidebar'
import { ToastProvider } from '@/shared/ui/toast'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<TooltipProvider delayDuration={0}>
				<ToastProvider>{children}</ToastProvider>
			</TooltipProvider>
		</SidebarProvider>
	)
}
