import { ToastProvider, TooltipProvider } from '@/shared/ui/'

export function Providers({ children }: children) {
	return (
		<TooltipProvider delayDuration={0}>
			<ToastProvider>{children}</ToastProvider>
		</TooltipProvider>
	)
}
