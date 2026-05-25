<script lang="ts">
	import ArticleDetailView from '$lib/components/features/article/ArticleDetailView.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	const description = $derived(
		data.article.snippet
			? data.article.snippet.replace(/<[^>]+>/g, '')
			: `Read the full article: ${data.article.title}`
	);
</script>

<svelte:head>
	<title>{data.article.title} | JAccountable</title>
	<meta name="description" content={description} />

	<!-- Open Graph -->
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.article.title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:image" content={`${page.url.origin}/og-image.png`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	{#if data.article.publishedDate}
		<meta property="article:published_time" content={data.article.publishedDate} />
	{/if}
	{#each data.article.entities as entity (entity)}
		<meta property="article:tag" content={entity} />
	{/each}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.article.title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={`${page.url.origin}/og-image.png`} />
</svelte:head>

<ArticleDetailView article={data.article} relatedArticles={data.relatedArticles} />
