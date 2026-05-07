<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import posthog from 'posthog-js';
	import favicon from '$lib/assets/favicon-96x96.png';
	import Header from '$lib/components/features/Header.svelte';
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
</svelte:head>

<Tooltip.Provider>
	{#if !page.error}
		<Header />
	{/if}
	{@render children()}
</Tooltip.Provider>
