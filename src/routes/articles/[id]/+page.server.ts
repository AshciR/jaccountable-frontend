import type { PageServerLoad } from './$types';
import type { Article } from '$lib/api/types';
import { error } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const base = privateEnv.INTERNAL_API_BASE_URL ?? publicEnv.PUBLIC_API_BASE_URL ?? '';

	const res = await fetch(`${base}/api/v1/articles/${params.id}`);

	if (res.status === 404 || res.status === 422) {
		throw error(404, 'Article not found');
	}

	if (!res.ok) {
		throw error(500, 'Failed to load article');
	}

	const article: Article = await res.json();
	return { article };
};
