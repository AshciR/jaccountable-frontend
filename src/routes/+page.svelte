<script lang="ts">
	import { onMount } from 'svelte';
	import HeroSection from '$lib/components/features/HeroSection.svelte';
	import ChallengeSection from '$lib/components/features/ChallengeSection.svelte';
	import SearchSection from '$lib/components/features/SearchSection.svelte';
	import FeaturesSection from '$lib/components/features/FeaturesSection.svelte';
	import FAQSection from '$lib/components/features/FAQSection.svelte';
	import ShareSection from '$lib/components/features/ShareSection.svelte';
	import Footer from '$lib/components/features/Footer.svelte';
	import type { Article, EntitySummary, EntitySortOrder } from '$lib/api/types';
	import { searchArticles } from '$lib/api/articles';
	import { fetchTopEntities } from '$lib/api/entities';

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
		results: [],
		isLoading: true,
		isLoadingMore: false,
		hasSearched: false,
		query: '',
		topics: [],
		selectedTopic: null,
		topicSort: 'most_found',
		currentPage: 1,
		totalPages: 1,
		total: 0
	});

	const displayedArticles: Article[] = $derived(searchState.results);
	const hasMoreResults: boolean = $derived(searchState.currentPage < searchState.totalPages);
	const remainingCount: number = $derived(searchState.total - searchState.results.length);
	const sectionLabel: string = $derived(
		searchState.hasSearched ? searchState.query : (searchState.selectedTopic ?? 'Latest Stories')
	);
	const noResults: boolean = $derived(searchState.hasSearched && searchState.results.length === 0);

	onMount(() => {
		fetchLatestStories();
		fetchTopics();
	});

	async function fetchLatestStories(): Promise<void> {
		try {
			const data = await searchArticles();
			searchState.results = data.items;
			searchState.currentPage = data.page;
			searchState.totalPages = data.pages;
			searchState.total = data.total;
		} finally {
			searchState.isLoading = false;
		}
	}

	async function fetchTopics(): Promise<void> {
		try {
			searchState.topics = await fetchTopEntities(searchState.topicSort);
		} catch {
			// Topics are non-critical; silently fail
		}
	}

	async function handleSearch(query: string): Promise<void> {
		if (!query.trim()) {
			searchState.hasSearched = false;
			searchState.query = '';
			searchState.isLoading = true;
			await fetchLatestStories();
			return;
		}

		// Free-text search takes over from any topic selection
		searchState.selectedTopic = null;
		searchState.isLoading = true;
		searchState.hasSearched = true;
		searchState.query = query;
		try {
			const data = await searchArticles({ query });
			searchState.results = data.items;
			searchState.currentPage = data.page;
			searchState.totalPages = data.pages;
			searchState.total = data.total;
		} finally {
			searchState.isLoading = false;
		}
	}

	async function handleTopicClick(name: string): Promise<void> {
		// Clicking the already-selected topic deselects it, returning to latest stories
		if (searchState.selectedTopic === name) {
			searchState.selectedTopic = null;
			searchState.hasSearched = false;
			searchState.query = '';
			searchState.isLoading = true;
			await fetchLatestStories();
			return;
		}

		// Select the topic and search for articles mentioning it
		searchState.selectedTopic = name;
		searchState.isLoading = true;
		searchState.hasSearched = true;
		searchState.query = name;
		try {
			const data = await searchArticles({ query: name });
			searchState.results = data.items;
			searchState.currentPage = data.page;
			searchState.totalPages = data.pages;
			searchState.total = data.total;
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
			const data = await searchArticles({
				...(searchState.hasSearched ? { query: searchState.query } : {}),
				page: searchState.currentPage + 1
			});
			searchState.results = [...searchState.results, ...data.items];
			searchState.currentPage = data.page;
			searchState.totalPages = data.pages;
			searchState.total = data.total;
		} finally {
			searchState.isLoadingMore = false;
		}
	}
</script>

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
	onSearch={handleSearch}
	onTopicClick={handleTopicClick}
	onSortChange={handleSortChange}
	onLoadMore={handleLoadMore}
/>
<FeaturesSection />
<FAQSection />
<ShareSection />
<Footer />
