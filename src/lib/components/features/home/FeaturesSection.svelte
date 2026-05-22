<script lang="ts">
	import { Newspaper, BrainCog, UserSearch } from 'lucide-svelte';
</script>

<section id="how-it-works" class="bg-surface py-24 relative overflow-hidden">
	<!-- Decorative blur element -->
	<div
		class="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48"
	></div>

	<div class="max-w-5xl mx-auto px-6">
		<!-- Header -->
		<div class="text-center mb-16">
			<span class="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
				How It Works
			</span>

			<h2 class="text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
				From Noise to Clarity
			</h2>

			<p class="text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
				Our proprietary AI engine ingests thousands of documents to connect the dots you might miss.
			</p>
		</div>

		<!-- Feature columns -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-12">
			<!-- Data Ingestion -->
			<div class="text-center group">
				<div class="relative w-20 h-20 mx-auto mb-6">
					<div class="icon-glow"></div>
					<div
						class="relative w-full h-full bg-accent/10 rounded-full flex items-center justify-center"
					>
						<Newspaper class="w-9 h-9 text-accent" />
					</div>
				</div>
				<h3 class="text-xl font-bold text-primary mb-3">Data Ingestion</h3>
				<p class="text-neutral-500 text-sm leading-relaxed">
					Documents from government sources, news archives, and official records are continuously
					collected and indexed.
				</p>
			</div>

			<!-- AI Classification -->
			<div class="text-center group">
				<div class="relative w-20 h-20 mx-auto mb-6">
					<div class="icon-glow"></div>
					<div
						class="relative w-full h-full bg-secondary/15 rounded-full flex items-center justify-center"
					>
						<BrainCog class="w-9 h-9 text-secondary-foreground" />
					</div>
				</div>
				<h3 class="text-xl font-bold text-primary mb-3">AI Classification</h3>
				<p class="text-neutral-500 text-sm leading-relaxed">
					Our AI classification engine identifies articles about corruption, and link related
					stories across decades.
				</p>
			</div>

			<!-- Public Access -->
			<div class="text-center group">
				<div class="relative w-20 h-20 mx-auto mb-6">
					<div class="icon-glow"></div>
					<div
						class="relative w-full h-full bg-accent/10 rounded-full flex items-center justify-center"
					>
						<UserSearch class="w-9 h-9 text-accent" />
					</div>
				</div>
				<h3 class="text-xl font-bold text-primary mb-3">Public Access</h3>
				<p class="text-neutral-500 text-sm leading-relaxed">
					The data is made searchable for journalists, researchers, and concerned citizens.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.icon-glow {
		position: absolute;
		inset: -4px;
		background: conic-gradient(var(--accent), var(--secondary), var(--accent));
		border-radius: 9999px;
		filter: blur(8px);
		opacity: 0;
		transition: opacity 300ms ease;
		z-index: 0;
	}

	.group:hover .icon-glow {
		opacity: 0.4;
	}
</style>
