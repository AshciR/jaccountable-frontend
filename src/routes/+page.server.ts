import type { PageServerLoad } from './$types';
import type { Article, EntitySummary, MetricsResponse } from '$lib/api/types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { buildAnalyticHeaders } from '$lib/server/analytics';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	// In Docker, the browser can reach the API at localhost but the container cannot —
	// inside a container, localhost refers to the container itself, not the host machine.
	// INTERNAL_API_BASE_URL lets the server use a container-reachable URL (e.g.
	// http://host.docker.internal:8000) while PUBLIC_API_BASE_URL stays as the
	// browser-reachable URL. Falls back to PUBLIC_API_BASE_URL in production where
	// both use the same public host.
	const base = privateEnv.INTERNAL_API_BASE_URL ?? publicEnv.PUBLIC_API_BASE_URL ?? '';
	const headers = buildAnalyticHeaders(cookies, url);

	const [articlesRes, entitiesRes, metricsRes] = await Promise.all([
		fetch(`${base}/api/v1/articles?sort=published_date&order=desc&page_size=5&page=1`, { headers }),
		fetch(`${base}/api/v1/entities?sort=most_found&page_size=8`, { headers }),
		fetch(`${base}/api/v1/metrics`, { headers })
	]);

	const articlesData = articlesRes.ok ? await articlesRes.json() : null;
	const latestArticles: Article[] = articlesData?.items ?? [];
	const latestPage: number = articlesData?.page ?? 1;
	const latestTotalPages: number = articlesData?.pages ?? 1;
	const latestTotal: number = articlesData?.total ?? 0;

	const entitiesData = entitiesRes.ok ? await entitiesRes.json() : null;
	const topics: EntitySummary[] = entitiesData?.items ?? [];

	const metrics: MetricsResponse | null = metricsRes.ok ? await metricsRes.json() : null;

	return { latestArticles, latestPage, latestTotalPages, latestTotal, topics, metrics };
};
