<script lang="ts">
	import PrivacyPolicy from '$lib/content/legal/privacy-v0.svx';
	import Footer from '$lib/components/features/Footer.svelte';
</script>

<section class="py-24 px-6">
	<div class="max-w-4xl mx-auto">
		<span class="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block"> Legal </span>
		<h1 class="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">Privacy Policy</h1>
		<div class="privacy-content">
			<PrivacyPolicy />
		</div>
	</div>
</section>
<Footer />

<style>
	.privacy-content :global(h2) {
		font-size: 1.5rem;
		line-height: 2rem;
		font-weight: 700;
		color: var(--primary);
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

	.privacy-content :global(h3) {
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 700;
		color: var(--primary);
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	.privacy-content :global(p) {
		color: var(--muted-foreground);
		line-height: 1.75;
		margin-bottom: 1rem;
	}

	.privacy-content :global(ul) {
		color: var(--muted-foreground);
		line-height: 1.75;
		margin-bottom: 1rem;
		padding-left: 1.5rem;
		list-style-type: disc;
	}

	.privacy-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.privacy-content :global(strong) {
		color: var(--foreground);
		font-weight: 600;
	}

	.privacy-content :global(a) {
		color: var(--accent);
		text-decoration: underline;
		transition: color 200ms;
	}

	.privacy-content :global(a:hover) {
		color: var(--accent-hover);
	}

	.privacy-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		margin-top: 0.5rem;
		font-size: 0.875rem;
	}

	.privacy-content :global(th) {
		text-align: left;
		font-weight: 600;
		color: var(--foreground);
		padding: 0.75rem 1rem;
		border-bottom: 2px solid var(--border);
	}

	.privacy-content :global(td) {
		color: var(--muted-foreground);
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
	}

	.privacy-content :global(hr) {
		border: none;
		border-top: 1px solid var(--border);
		margin: 2.5rem 0;
	}
</style>
