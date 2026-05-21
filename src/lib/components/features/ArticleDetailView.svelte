<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { resolve } from '$app/paths';
	import type { Article } from '$lib/api/types';
	import ArticleSourceHeader from './ArticleSourceHeader.svelte';
	import AnalysisAlert from './AnalysisAlert.svelte';

	let { article }: { article: Article } = $props();

	const paragraphs = $derived(
		article.fullText
			? article.fullText
					.split('\n\n')
					.map((p) => p.trim())
					.filter((p) => p.length > 0)
			: []
	);
</script>

<main class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:max-w-5xl lg:py-16">
	<a
		href="{resolve('/')}#search"
		class="mt-6 mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent-hover"
	>
		← Back to articles
	</a>

	<Card.Root class="shadow-sm">
		<Card.Header class="pb-3">
			<ArticleSourceHeader {article} />
		</Card.Header>

		<Card.Content class="space-y-6 px-4 sm:px-6">
			<!-- Title -->
			<h1 class="text-2xl font-bold leading-tight text-foreground md:text-3xl">
				{article.title}
			</h1>

			<!-- Mentioned entities -->
			{#if article.entities.length > 0}
				<div>
					<h2 class="mb-2 text-sm font-semibold text-accent">Mentioned</h2>
					<div class="flex flex-wrap gap-2">
						{#each article.entities as entity (entity)}
							<span
								class="rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
							>
								{entity}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Analysis -->
			{#if article.classifications.length > 0}
				{@const classification = article.classifications[0]}
				<div>
					<h2 class="mb-3 text-sm font-semibold text-accent">Analysis</h2>
					{#if classification.reasoning}
						<AnalysisAlert reasoning={classification.reasoning} />
					{/if}
				</div>
			{/if}

			<!-- Full article text -->
			<div>
				<h2 class="mb-3 text-sm font-semibold text-accent">Full Article</h2>
				{#if paragraphs.length > 0}
					<div class="space-y-4 text-md leading-7 text-foreground">
						{#each paragraphs as paragraph, i (i)}
							<p>{paragraph}</p>
						{/each}
					</div>
				{:else}
					<p class="text-sm italic text-muted-foreground">Full article text is not available.</p>
				{/if}
			</div>

			<!-- eslint-disable svelte/no-navigation-without-resolve -- External link -->
			<a
				href={article.url}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm font-medium text-primary underline hover:text-accent-hover"
			>
				Read original article →
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</Card.Content>
	</Card.Root>
</main>
