import { http, HttpResponse, delay } from 'msw';
import type { MetricsResponse } from '$lib/api/types';
import { mockMetrics } from '../fixtures/metrics';

export const metricsHandlers = [
	http.get<never, never, MetricsResponse>('*/api/v1/metrics', async () => {
		if (!import.meta.env.TEST) {
			await delay(500);
		}
		return HttpResponse.json(mockMetrics);
	})
];
