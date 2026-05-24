import type { PageServerLoad } from './$types';
import type { Article } from '$lib/api/types';
import { error } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { buildAnalyticHeaders } from '$lib/server/analytics';

export const load: PageServerLoad = async ({ fetch, params, cookies, url }) => {
	const base = privateEnv.INTERNAL_API_BASE_URL ?? publicEnv.PUBLIC_API_BASE_URL ?? '';
	const headers = buildAnalyticHeaders(cookies, url);

	const [res, relatedRes] = await Promise.all([
		fetch(`${base}/api/v1/articles/${params.id}`, { headers }),
		fetch(`${base}/api/v1/articles/${params.id}/related?limit=4`, { headers }).catch(() => null)
	]);

	if (res.status === 404 || res.status === 422) {
		throw error(404, 'Article not found');
	}

	if (!res.ok) {
		throw error(500, 'Failed to load article');
	}

	const article: Article = await res.json();

	let relatedArticles: Article[] = [];
	if (relatedRes?.ok) {
		const data: { articles: Article[] } = await relatedRes.json();
		relatedArticles = data.articles ?? [];
	}

	return { article, relatedArticles };
};
