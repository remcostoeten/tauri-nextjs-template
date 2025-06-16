import {  TooltipProvider } from '@/shared/ui/'
import { ToastProvider } from '@/shared/ui/toast'

export function Providers({ children }: children) {
	return (
		<TooltipProvider delayDuration={0}>
			<ToastProvider>{children}</ToastProvider>
		</TooltipProvider>
	)
}
