'use server';

import { db } from '@/api/db/connection';
import { cookies } from 'next/headers';
import { sessions, users } from '@/api/db/schema';
import { signJWT, verifyJWT } from './jwt';
import { eq } from 'drizzle-orm';

const COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
	httpOnly: true,
	path: '/',
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
} as const;

const SESSION_EXPIRY_DAYS = 7;

export async function createSession(user: {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
}) {
	const token = await signJWT({
		sub: user.id,
		email: user.email,
		...(user.name && { name: user.name }),
		...(user.avatar && { avatar: user.avatar }),
	});

	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

	await db.insert(sessions).values({
		userId: user.id,
		expiresAt,
	});

	const cookieStore = await cookies();
	cookieStore.set(COOKIE_NAME, token, {
		...COOKIE_OPTIONS,
		maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
	});
}

export async function destroySession() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;
	if (!token) return null;

	const payload = await verifyJWT(token);
	if (!payload) {
		cookieStore.delete(COOKIE_NAME);
		return null;
	}

	const user = await db
		.select()
		.from(users)
		.where(eq(users.id, payload.sub as string))
		.limit(1);

	if (!user.length) {
		cookieStore.delete(COOKIE_NAME);
		return null;
	}

	return {
		id: user[0].id,
		email: user[0].email,
		name: user[0].name,
		avatar: user[0].avatar,
	};
}
