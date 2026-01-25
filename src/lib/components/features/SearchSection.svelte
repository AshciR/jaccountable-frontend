<script lang="ts">
	import { fade } from 'svelte/transition';
	import SearchBar from './SearchBar.svelte';
	import ArticleCard from './ArticleCard.svelte';
	import type { Article, SearchResponse } from '$lib/api/types';

	const MAX_PREVIEW_RESULTS = 3;

	let searchResults = $state<Article[]>([]);
	let latestArticles = $state<Article[]>([]);
	let isLoading = $state(true);
	let hasSearched = $state(false);
	let searchQuery = $state('');

	const displayedArticles = $derived(
		hasSearched ? searchResults.slice(0, MAX_PREVIEW_RESULTS) : latestArticles
	);
	const hasMoreResults = $derived(hasSearched && searchResults.length > MAX_PREVIEW_RESULTS);
	const remainingCount = $derived(searchResults.length - MAX_PREVIEW_RESULTS);
	const sectionLabel = $derived(hasSearched ? searchQuery : 'Latest Stories');
	const noResults = $derived(hasSearched && searchResults.length === 0);

	$effect(() => {
		fetchLatestStories();
	});

	async function fetchLatestStories() {
		try {
			const response = await fetch(
				'/api/v1/articles/search?sort=published_date&order=desc&page_size=3'
			);
			const data: SearchResponse = await response.json();
			latestArticles = data.data;
		} finally {
			isLoading = false;
		}
	}

	async function handleSearch(query: string) {
		if (!query.trim()) {
			hasSearched = false;
			searchQuery = '';
			return;
		}

		isLoading = true;
		hasSearched = true;
		searchQuery = query;
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
			<div class="mt-8 text-center text-neutral-500" transition:fade={{ duration: 300 }}>
				Loading...
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
					{#key hasSearched ? searchQuery : 'latest'}
						<div class="space-y-4" transition:fade={{ duration: 300 }}>
							{#each displayedArticles as article (article.id)}
								<ArticleCard {article} />
							{/each}
						</div>
					{/key}
					{#if hasMoreResults}
						<div class="mt-6 text-center">
							<p class="text-neutral-600 mb-2">
								{remainingCount} more result{remainingCount === 1 ? '' : 's'} available
							</p>
						</div>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</section>
