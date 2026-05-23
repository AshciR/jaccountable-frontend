<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { resolve } from '$app/paths';
	import type { Article } from '$lib/api/types';
	import ArticleSourceHeader from '../ArticleSourceHeader.svelte';

	let { article }: { article: Article } = $props();

	const excerpt = $derived(() => {
		if (!article.fullText) return null;
		const sentences = article.fullText
			.split(/(?<=[.!?])\s+/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0)
			.slice(0, 2);
		return sentences.join(' ');
	});
</script>

<Card.Root
	class="relative overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:border-gold-600 h-full"
>
	<Card.Header class="pb-3">
		<ArticleSourceHeader {article} />
	</Card.Header>

	<Card.Content class="space-y-3 px-4 sm:px-6">
		<h3 class="text-sm font-semibold leading-tight text-card-foreground">
			<a
				href={resolve(`/articles/${article.id}`)}
				class="after:absolute after:inset-0 hover:underline hover:text-accent-hover"
			>
				{article.title}
			</a>
		</h3>

		{#if excerpt()}
			<p class="text-xs leading-relaxed text-muted-foreground line-clamp-3">
				{excerpt()}…
			</p>
		{/if}

		{#if article.entities.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each article.entities as entity (entity)}
					<span
						class="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
					>
						{entity}
					</span>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
