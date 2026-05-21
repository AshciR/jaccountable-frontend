<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { Article } from '$lib/api/types';
	import gleanerIcon from '$lib/assets/gleaner-article-card-icon.png';
	import observerIcon from '$lib/assets/observer-article-card-icon.png';
	import fallbackIcon from '$lib/assets/fallback-article-card-icon.png';

	let { article }: { article: Article } = $props();

	const classification = $derived(article.classifications[0]);

	const base = 'inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold';

	function confidencePillClass(score: number): string {
		if (score >= 0.9) return `${base} bg-green-100 text-green-700 border-green-400`;
		if (score >= 0.8) return `${base} bg-green-50 text-green-500 border-green-200`;
		return `${base} bg-gold-50 text-gold-700 border-gold-200`;
	}

	function confidenceDisplay(score: number): string {
		return `${Math.round(score * 100)}%`;
	}

	const formattedDate = $derived(() => {
		if (!article.publishedDate) return '';
		const date = new Date(article.publishedDate);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	});

	const sourceIcon = $derived(
		article.newsSource === 'JAMAICA_GLEANER'
			? gleanerIcon
			: article.newsSource === 'JAMAICA_OBSERVER'
				? observerIcon
				: fallbackIcon
	);

	const sourceName = $derived(
		article.newsSource === 'JAMAICA_GLEANER'
			? 'Jamaica Gleaner'
			: article.newsSource === 'JAMAICA_OBSERVER'
				? 'Jamaica Observer'
				: 'Source'
	);
</script>

<div class="flex items-start justify-between gap-4">
	<div class="flex items-center gap-3">
		<img src={sourceIcon} alt={sourceName} class="h-9 w-9 rounded-sm object-cover" loading="lazy" />
		<div>
			<div class="text-sm font-medium text-muted-foreground">{sourceName}</div>
			{#if article.publishedDate}
				<time datetime={article.publishedDate} class="text-xs text-muted-foreground">
					{formattedDate()}
				</time>
			{/if}
			{#if classification}
				<Tooltip.Root>
					<Tooltip.Trigger class="mt-1 block w-fit">
						<Badge
							variant="destructive"
							class="capitalize"
							data-testid="source-header-classifier-type"
						>
							{classification.classifierType.toLowerCase()}
						</Badge>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>
							This label shows what kind of accountability issue our AI identified in this article.
						</p>
					</Tooltip.Content>
				</Tooltip.Root>
			{/if}
		</div>
	</div>

	{#if classification}
		<Tooltip.Root>
			<Tooltip.Trigger>
				<span
					class={confidencePillClass(classification.confidenceScore)}
					data-testid="source-header-confidence"
				>
					Certainty <strong class="ml-1">{confidenceDisplay(classification.confidenceScore)}</strong
					>
				</span>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>
					How certain the AI is that this article belongs to this category. Scores above 80% are
					considered high certainty.
				</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/if}
</div>
