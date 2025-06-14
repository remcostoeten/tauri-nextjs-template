'use server';

import { GoogleOAuthService } from '../services/google-oauth-service';

export async function generateGoogleAuthUrl(redirectTo = '/space') {
	const service = new GoogleOAuthService();
	const state = { provider: 'google' as const, redirectTo };
	return service.generateAuthUrl(state);
}
