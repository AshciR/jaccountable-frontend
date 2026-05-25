<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import posthog from 'posthog-js';
	import favicon from '$lib/assets/favicon-96x96.png';
	import Header from '$lib/components/features/Header.svelte';
	import Footer from '$lib/components/features/Footer.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import '../app.css';

	let { children } = $props();

	// Because it's a Single-Page Application, we need to manually
	// capture the $pageview in an effect.
	$effect(() => {
		if (browser) {
			posthog.capture('$pageview', { path: page.url.pathname });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>JAccountable — Jamaica Government Accountability Tracker</title>
	<meta
		name="description"
		content="Track government accountability and corruption stories in Jamaica. JAccountable monitors Jamaican news sources to archive and surface political accountability journalism."
	/>

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="JAccountable" />
	<meta property="og:title" content="JAccountable — Jamaica Government Accountability Tracker" />
	<meta
		property="og:description"
		content="Track government accountability and corruption stories in Jamaica. JAccountable monitors Jamaican news sources to archive and surface political accountability journalism."
	/>
	<meta property="og:url" content={page.url.href} />
	<meta property="og:image" content={`${page.url.origin}/og-image.png`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="JAccountable — Jamaica Government Accountability Tracker" />
	<meta
		name="twitter:description"
		content="Track government accountability and corruption stories in Jamaica. JAccountable monitors Jamaican news sources to archive and surface political accountability journalism."
	/>
	<meta name="twitter:image" content={`${page.url.origin}/og-image.png`} />
</svelte:head>

<Tooltip.Provider>
	{#if !page.error}
		<Header />
	{/if}
	{@render children()}
	{#if !page.error}
		<Footer />
	{/if}
</Tooltip.Provider>
