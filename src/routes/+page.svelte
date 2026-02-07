<script lang="ts">
	import { onMount } from 'svelte';
	import HeroSection from '$lib/components/features/HeroSection.svelte';
	import ChallengeSection from '$lib/components/features/ChallengeSection.svelte';
	import SearchSection from '$lib/components/features/SearchSection.svelte';
	import FeaturesSection from '$lib/components/features/FeaturesSection.svelte';
	import FAQSection from '$lib/components/features/FAQSection.svelte';
	import ShareSection from '$lib/components/features/ShareSection.svelte';
	import Footer from '$lib/components/features/Footer.svelte';
	import type { Article, EntitySummary } from '$lib/api/types';
	import { searchArticles } from '$lib/api/articles';
	import { fetchTopEntities } from '$lib/api/entities';
	import { trackEvent } from '$lib/utils/analytics';

	const MAX_PREVIEW_RESULTS: number = 3;

	let searchState: {
		results: Article[];
		latestArticles: Article[];
		isLoading: boolean;
		hasSearched: boolean;
		query: string;
		topics: EntitySummary[];
	} = $state({
		results: [],
		latestArticles: [],
		isLoading: true,
		hasSearched: false,
		query: '',
		topics: []
	});

	const displayedArticles: Article[] = $derived(
		searchState.hasSearched
			? searchState.results.slice(0, MAX_PREVIEW_RESULTS)
			: searchState.latestArticles
	);
	const hasMoreResults: boolean = $derived(
		searchState.hasSearched && searchState.results.length > MAX_PREVIEW_RESULTS
	);
	const remainingCount: number = $derived(searchState.results.length - MAX_PREVIEW_RESULTS);
	const sectionLabel: string = $derived(
		searchState.hasSearched ? searchState.query : 'Latest Stories'
	);
	const noResults: boolean = $derived(searchState.hasSearched && searchState.results.length === 0);

	onMount(() => {
		fetchLatestStories();
		fetchTopics();
	});

	async function fetchLatestStories(): Promise<void> {
		try {
			searchState.latestArticles = await searchArticles();
		} finally {
			searchState.isLoading = false;
		}
	}

	async function fetchTopics(): Promise<void> {
		try {
			searchState.topics = await fetchTopEntities();
		} catch {
			// Topics are non-critical; silently fail
		}
	}

	async function handleSearch(query: string): Promise<void> {
		if (!query.trim()) {
			searchState.hasSearched = false;
			searchState.query = '';
			return;
		}

		searchState.isLoading = true;
		searchState.hasSearched = true;
		searchState.query = query;
		try {
			searchState.results = await searchArticles(query);
			trackEvent('search:query_submit', {
				search_query: query,
				results_count: searchState.results.length
			});
		} finally {
			searchState.isLoading = false;
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
	topics={searchState.topics}
	onSearch={handleSearch}
	onTopicClick={handleSearch}
/>
<FeaturesSection />
<FAQSection />
<ShareSection />
<Footer />
