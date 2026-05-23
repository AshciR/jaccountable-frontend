import type { MetricsResponse } from './types';
import { apiFetch } from './fetch';

export async function fetchMetrics(): Promise<MetricsResponse | null> {
	const response = await apiFetch('/api/v1/metrics');
	if (!response.ok) {
		return null;
	}
	return response.json();
}
