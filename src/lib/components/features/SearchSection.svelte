<script lang="ts">
	import SearchBar from './SearchBar.svelte';
	import type { Article, SearchResponse } from '$lib/api/types';

	let searchResults = $state<Article[]>([]);
	let isLoading = $state(false);
	let hasSearched = $state(false);

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
					<p class="text-sm text-neutral-500 mb-4">
						{searchResults.length} result{searchResults.length === 1 ? '' : 's'} found
					</p>
					<ul class="space-y-4">
						{#each searchResults as article (article.id)}
							<li class="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
								<a href={article.url} target="_blank" rel="noopener noreferrer" class="block">
									<h3
										class="text-lg font-semibold text-primary hover:text-accent transition-colors"
									>
										{article.title}
									</h3>
									<p class="text-sm text-neutral-500 mt-1">
										{article.section} &middot; {new Date(
											article.published_date
										).toLocaleDateString()}
									</p>
									<p class="text-neutral-700 mt-2">{article.snippet}</p>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<div class="mt-8 text-center text-neutral-500">No results found</div>
			{/if}
		{/if}
	</div>
</section>
