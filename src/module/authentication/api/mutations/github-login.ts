'use server';

import { GitHubOAuthService } from "../services/github-oauth-service";


export async function generateGitHubAuthUrl(redirectTo: string = '/space') {
	const service = new GitHubOAuthService();
	const state = { provider: 'github' as const, redirectTo };
	return service.generateAuthUrl(state);
}
