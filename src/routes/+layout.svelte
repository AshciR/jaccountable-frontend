<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import posthog from 'posthog-js';
	import favicon from '$lib/assets/favicon-96x96.png';
	import Header from '$lib/components/features/Header.svelte';
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
</svelte:head>

{#if !page.error}
	<Header />
{/if}
{@render children()}
