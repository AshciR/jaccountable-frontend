import type { PageServerLoad } from './$types';
import type { Article, EntitySummary } from '$lib/api/types';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
	const base = PUBLIC_API_BASE_URL ?? '';

	const [articlesRes, entitiesRes] = await Promise.all([
		fetch(`${base}/api/v1/articles?sort=published_date&order=desc&page_size=5&page=1`),
		fetch(`${base}/api/v1/entities?sort=most_found&page_size=8`)
	]);

	const articlesData = articlesRes.ok ? await articlesRes.json() : null;
	const latestArticles: Article[] = articlesData?.items ?? [];
	const latestPage: number = articlesData?.page ?? 1;
	const latestTotalPages: number = articlesData?.pages ?? 1;
	const latestTotal: number = articlesData?.total ?? 0;

	const entitiesData = entitiesRes.ok ? await entitiesRes.json() : null;
	const topics: EntitySummary[] = entitiesData?.items ?? [];

	return { latestArticles, latestPage, latestTotalPages, latestTotal, topics };
};
