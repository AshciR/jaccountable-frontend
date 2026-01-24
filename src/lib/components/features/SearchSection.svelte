<script lang="ts">
	import SearchBar from './SearchBar.svelte';
	import ArticleCard from './ArticleCard.svelte';
	import type { Article, SearchResponse } from '$lib/api/types';

	const MAX_PREVIEW_RESULTS = 3;

	let searchResults = $state<Article[]>([]);
	let isLoading = $state(false);
	let hasSearched = $state(false);

	const displayedResults = $derived(searchResults.slice(0, MAX_PREVIEW_RESULTS));
	const hasMoreResults = $derived(searchResults.length > MAX_PREVIEW_RESULTS);
	const remainingCount = $derived(searchResults.length - MAX_PREVIEW_RESULTS);

	async function handleSearch(query: string) {
		isLoading = true;
		hasSearched = true;
		try {
			const response = await fetch(`/api/v1/articles/search?q=${encodeURIComponent(query)}`);
			const data: SearchResponse = await response.json();
			searchResults = data.data;
		} finally {
			isLoading = false;
		}
	}
</script>

<section class="py-20 bg-neutral-100 border-y border-primary/5" id="search">
	<div class="max-w-4xl mx-auto px-6">
		<div class="max-w-3xl mx-auto">
			<SearchBar placeholder="Search for articles. Ex. Petrojam" onSearch={handleSearch} />
		</div>

		{#if isLoading}
			<div class="mt-8 text-center text-neutral-500">Loading...</div>
		{:else if hasSearched}
			{#if searchResults.length > 0}
				<div class="mt-8">
					<div class="space-y-4">
						{#each displayedResults as article (article.id)}
							<ArticleCard {article} />
						{/each}
					</div>
					{#if hasMoreResults}
						<div class="mt-6 text-center">
							<p class="text-neutral-600 mb-2">
								{remainingCount} more result{remainingCount === 1 ? '' : 's'} available
							</p>
						</div>
					{/if}
				</div>
			{:else}
				<div class="mt-8 text-center text-neutral-500">No results found</div>
			{/if}
		{/if}
	</div>
</section>
