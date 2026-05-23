<script lang="ts">
	import HeroSection from '$lib/components/features/home/HeroSection.svelte';
	import ChallengeSection from '$lib/components/features/home/ChallengeSection.svelte';
	import SearchSection from '$lib/components/features/home/SearchSection.svelte';
	import FeaturesSection from '$lib/components/features/home/FeaturesSection.svelte';
	import FAQSection from '$lib/components/features/home/FAQSection.svelte';
	import ShareSection from '$lib/components/features/home/ShareSection.svelte';
	import { untrack } from 'svelte';
	import type { Article, EntitySummary, EntitySortOrder } from '$lib/api/types';
	import type { PageData } from './$types';
	import { searchArticles } from '$lib/api/articles';
	import { fetchTopEntities } from '$lib/api/entities';

	let { data }: { data: PageData } = $props();

	const {
		latestArticles,
		latestPage,
		latestTotalPages,
		latestTotal,
		topics: initialTopics
	} = untrack(() => data);

	let searchState: {
		results: Article[];
		isLoading: boolean;
		isLoadingMore: boolean;
		hasSearched: boolean;
		query: string;
		topics: EntitySummary[];
		selectedTopic: string | null;
		topicSort: EntitySortOrder;
		currentPage: number;
		totalPages: number;
		total: number;
	} = $state({
		results: latestArticles,
		isLoading: false,
		isLoadingMore: false,
		hasSearched: false,
		query: '',
		topics: initialTopics,
		selectedTopic: null,
		topicSort: 'latest',
		currentPage: latestPage,
		totalPages: latestTotalPages,
		total: latestTotal
	});

	const displayedArticles: Article[] = $derived(searchState.results);
	const hasMoreResults: boolean = $derived(searchState.currentPage < searchState.totalPages);
	const remainingCount: number = $derived(searchState.total - searchState.results.length);
	const sectionLabel: string = $derived(
		searchState.hasSearched ? searchState.query : (searchState.selectedTopic ?? 'Latest Stories')
	);
	const noResults: boolean = $derived(searchState.hasSearched && searchState.results.length === 0);

	async function handleSearch(query: string): Promise<void> {
		if (!query.trim()) {
			searchState.hasSearched = false;
			searchState.query = '';
			searchState.results = latestArticles;
			searchState.currentPage = latestPage;
			searchState.totalPages = latestTotalPages;
			searchState.total = latestTotal;
			return;
		}

		// Free-text search takes over from any topic selection
		searchState.selectedTopic = null;
		searchState.isLoading = true;
		searchState.hasSearched = true;
		searchState.query = query;
		try {
			const result = await searchArticles({ query });
			searchState.results = result.items;
			searchState.currentPage = result.page;
			searchState.totalPages = result.pages;
			searchState.total = result.total;
		} finally {
			searchState.isLoading = false;
		}
	}

	async function handleTopicClick(name: string): Promise<void> {
		document.getElementById('search')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

		// Clicking the already-selected topic deselects it, returning to latest stories
		if (searchState.selectedTopic === name) {
			searchState.selectedTopic = null;
			searchState.hasSearched = false;
			searchState.query = '';
			searchState.results = latestArticles;
			searchState.currentPage = latestPage;
			searchState.totalPages = latestTotalPages;
			searchState.total = latestTotal;
			return;
		}

		// Select the topic and search for articles mentioning it
		searchState.selectedTopic = name;
		searchState.isLoading = true;
		searchState.hasSearched = true;
		searchState.query = name;
		try {
			const result = await searchArticles({ query: name });
			searchState.results = result.items;
			searchState.currentPage = result.page;
			searchState.totalPages = result.pages;
			searchState.total = result.total;
		} finally {
			searchState.isLoading = false;
		}
	}

	async function handleSortChange(sort: EntitySortOrder): Promise<void> {
		searchState.topicSort = sort;
		// Clear selection since the topic list is changing
		searchState.selectedTopic = null;
		try {
			searchState.topics = await fetchTopEntities(sort);
		} catch {
			// Topics are non-critical; silently fail
		}
	}

	async function handleLoadMore(): Promise<void> {
		searchState.isLoadingMore = true;
		try {
			const result = await searchArticles({
				...(searchState.hasSearched ? { query: searchState.query } : {}),
				page: searchState.currentPage + 1
			});
			searchState.results = [...searchState.results, ...result.items];
			searchState.currentPage = result.page;
			searchState.totalPages = result.pages;
			searchState.total = result.total;
		} finally {
			searchState.isLoadingMore = false;
		}
	}
</script>

<main>
	<HeroSection />
	<ChallengeSection />
	<SearchSection
		{displayedArticles}
		{hasMoreResults}
		{remainingCount}
		{sectionLabel}
		{noResults}
		isLoading={searchState.isLoading}
		isLoadingMore={searchState.isLoadingMore}
		topics={searchState.topics}
		selectedTopic={searchState.selectedTopic}
		topicSort={searchState.topicSort}
		total={searchState.total}
		hasSearched={searchState.hasSearched}
		onSearch={handleSearch}
		onTopicClick={handleTopicClick}
		onSortChange={handleSortChange}
		onLoadMore={handleLoadMore}
	/>
	<FeaturesSection />
	<FAQSection />
	<ShareSection />
</main>
