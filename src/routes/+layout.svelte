<script lang="ts">
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon-96x96.png';
	import Header from '$lib/components/features/Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if !$page.error}
	<Header />
{/if}
{@render children()}
