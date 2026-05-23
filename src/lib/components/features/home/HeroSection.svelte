<script lang="ts">
	import { Newspaper, Tags } from 'lucide-svelte';
	import type { MetricsResponse } from '$lib/api/types';

	let { metrics }: { metrics: MetricsResponse | null } = $props();

	const COUNT_UP_DURATION_MS = 1200;

	let displayedArticles = $state(0);
	let displayedTopics = $state(0);

	function countUp(target: number, set: (n: number) => void): void {
		const start = performance.now();
		function tick(now: number) {
			const t = Math.min(1, (now - start) / COUNT_UP_DURATION_MS);
			// easeOutQuart for a snappy settle
			const eased = 1 - Math.pow(1 - t, 4);
			set(Math.round(target * eased));
			if (t < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	$effect(() => {
		if (!metrics) return;
		countUp(metrics.articleCount, (n) => (displayedArticles = n));
		countUp(metrics.entityCount, (n) => (displayedTopics = n));
	});
</script>

<section
	class="relative h-screen w-full overflow-hidden flex items-center justify-center bg-linear-to-b from-background to-neutral-300"
>
	<div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
		<h1
			class="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-8 tracking-tight text-primary"
		>
			<span class="block">Every <span class="gradient-text">Scandal.</span></span>
			<span class="block">Every <span class="gradient-text">Investigation.</span></span>
			<span class="block">One <span class="gradient-text">Place.</span></span>
		</h1>

		<p
			class="text-lg md:text-xl text-primary/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
		>
			Track how Jamaican news outlets cover
			<strong class="font-semibold text-primary">scandals</strong>,
			<strong class="font-semibold text-primary">investigations</strong>, and the
			<strong class="font-semibold text-primary">people</strong> behind them — all in one searchable place.
		</p>

		{#if metrics}
			<div class="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16">
				<div class="flex items-center gap-4" data-testid="metric-articles">
					<Newspaper class="w-10 h-10 md:w-12 md:h-12 text-accent" />
					<div class="text-left">
						<div class="text-4xl md:text-5xl font-bold text-primary leading-none tabular-nums">
							{displayedArticles.toLocaleString()}
						</div>
						<div class="text-sm md:text-base uppercase tracking-wider text-primary/70 mt-1">
							Articles
						</div>
					</div>
				</div>
				<div class="flex items-center gap-4" data-testid="metric-topics">
					<Tags class="w-10 h-10 md:w-12 md:h-12 text-accent" />
					<div class="text-left">
						<div class="text-4xl md:text-5xl font-bold text-primary leading-none tabular-nums">
							{displayedTopics.toLocaleString()}
						</div>
						<div class="text-sm md:text-base uppercase tracking-wider text-primary/70 mt-1">
							Topics
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.gradient-text {
		background: linear-gradient(
			90deg,
			var(--color-accent) 0%,
			var(--color-secondary) 50%,
			var(--color-accent) 100%
		);
		background-size: 200% 100%;
		background-position: 0% 0;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		transition: background-position 0.8s ease;
		cursor: default;
	}

	.gradient-text:hover {
		background-position: 100% 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.gradient-text {
			transition: none;
		}
	}
</style>
