<script lang="ts">
	import { fade } from 'svelte/transition';
	import SearchBar from './SearchBar.svelte';
	import TopicsBar from './TopicsBar.svelte';
	import ArticleCard from './ArticleCard.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import type { Article, EntitySummary, EntitySortOrder } from '$lib/api/types';

	let {
		displayedArticles,
		hasMoreResults,
		remainingCount,
		sectionLabel,
		noResults,
		isLoading,
		isLoadingMore,
		topics,
		selectedTopic,
		topicSort,
		onSearch,
		onTopicClick,
		onSortChange,
		onLoadMore
	}: {
		displayedArticles: Article[];
		hasMoreResults: boolean;
		remainingCount: number;
		sectionLabel: string;
		noResults: boolean;
		isLoading: boolean;
		isLoadingMore: boolean;
		topics: EntitySummary[];
		selectedTopic: string | null;
		topicSort: EntitySortOrder;
		onSearch: (query: string) => void;
		onTopicClick: (name: string) => void;
		onSortChange: (sort: EntitySortOrder) => void;
		onLoadMore: () => void;
	} = $props();
</script>

<section class="py-20 bg-neutral-100 border-y border-primary/5" id="search">
	<div class="max-w-4xl mx-auto px-6">
		<div class="max-w-3xl mx-auto">
			<SearchBar placeholder="Search articles — try a name, place, or topic…" {onSearch} />
			{#if topics.length > 0}
				<TopicsBar {topics} {selectedTopic} {topicSort} {onTopicClick} {onSortChange} />
			{/if}
		</div>

		{#if isLoading}
			<div class="mt-8 flex justify-center" transition:fade={{ duration: 300 }}>
				<Spinner class="size-8 text-accent" />
			</div>
		{:else}
			<div class="mt-12" transition:fade={{ duration: 300 }}>
				<div class="text-center mb-8">
					{#key sectionLabel}
						<span
							class="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block"
							data-testid="search-section-search-query"
							transition:fade={{ duration: 300 }}
						>
							{sectionLabel}
						</span>
					{/key}
				</div>

				{#if noResults}
					<div class="text-center text-neutral-500">No results found</div>
				{:else if displayedArticles.length > 0}
					{#key sectionLabel}
						<div class="space-y-4">
							{#each displayedArticles as article, index (article.id)}
								<div class="opacity-0 animate-fade-in" style="animation-delay: {index * 0.1}s;">
									<ArticleCard {article} {onTopicClick} />
								</div>
							{/each}
						</div>
					{/key}
					{#if hasMoreResults}
						<div class="mt-6 text-center">
							<button
								onclick={onLoadMore}
								disabled={isLoadingMore}
								class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-muted-foreground text-sm font-medium text-muted-foreground hover:bg-green-400 hover:text-accent-foreground hover:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
							>
								{#if isLoadingMore}
									<Spinner class="size-4 text-accent" />
									Loading…
								{:else}
									Load More ({remainingCount} remaining)
								{/if}
							</button>
						</div>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fadeIn 1s ease-out forwards;
	}
</style>
