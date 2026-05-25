import type { Article } from '$lib/api/types';
import { trackEvent } from '$lib/utils/analytics';

export type ShareMethod = 'native' | 'clipboard' | 'failed';

export interface ShareArticleResult {
	method: ShareMethod;
}

function buildShareUrl(articleId: string): string {
	return `${window.location.origin}/articles/${articleId}`;
}

export async function shareArticle(article: Article): Promise<ShareArticleResult> {
	const shareUrl = buildShareUrl(article.id);

	if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
		try {
			await navigator.share({
				title: article.title,
				text: article.title,
				url: shareUrl
			});
			trackEvent('share:article_native_share', { article_id: article.id });
			return { method: 'native' };
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				return { method: 'failed' };
			}
			console.error('Native share failed:', err);
		}
	}

	try {
		await navigator.clipboard.writeText(shareUrl);
		trackEvent('share:article_copy_url', { article_id: article.id });
		return { method: 'clipboard' };
	} catch (err) {
		console.error('Failed to copy article URL:', err);
		return { method: 'failed' };
	}
}
