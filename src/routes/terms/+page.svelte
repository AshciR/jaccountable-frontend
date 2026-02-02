<script lang="ts">
	import TermsOfService from '$lib/content/legal/terms-of-service-v0.svx';
	import Footer from '$lib/components/features/Footer.svelte';
</script>

<section class="py-24 px-6">
	<div class="max-w-4xl mx-auto">
		<span class="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block"> Legal </span>
		<h1 class="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">Terms of Service</h1>
		<div class="terms-content">
			<TermsOfService />
		</div>
	</div>
</section>
<Footer />

<style>
	.terms-content :global(h2) {
		font-size: 1.5rem;
		line-height: 2rem;
		font-weight: 700;
		color: var(--primary);
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

	.terms-content :global(h3) {
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 700;
		color: var(--primary);
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	.terms-content :global(p) {
		color: var(--muted-foreground);
		line-height: 1.75;
		margin-bottom: 1rem;
	}

	.terms-content :global(ul) {
		color: var(--muted-foreground);
		line-height: 1.75;
		margin-bottom: 1rem;
		padding-left: 1.5rem;
		list-style-type: disc;
	}

	.terms-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.terms-content :global(strong) {
		color: var(--foreground);
		font-weight: 600;
	}

	.terms-content :global(a) {
		color: var(--accent);
		text-decoration: underline;
		transition: color 200ms;
	}

	.terms-content :global(a:hover) {
		color: var(--accent-hover);
	}

	.terms-content :global(hr) {
		border: none;
		border-top: 1px solid var(--border);
		margin: 2.5rem 0;
	}
</style>
