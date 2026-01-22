<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';

	let {
		placeholder = 'Petrojam',
		onSearch = undefined
	}: {
		placeholder?: string;
		onSearch?: (query: string) => void;
	} = $props();

	let searchQuery = $state('');

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (searchQuery.trim()) {
			onSearch?.(searchQuery);
		}
	}
</script>

<form
	id="search-form"
	class="relative group transform transition-all duration-300"
	onsubmit={handleSubmit}
>
	<!-- Glow effect layer -->
	<div class="glow-effect"></div>

	<!-- Search input container -->
	<div class="relative bg-surface rounded-xl shadow-xl p-2 flex items-center">
		<Input
			type="text"
			bind:value={searchQuery}
			{placeholder}
			class="w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-xl py-6 px-4 text-primary placeholder:text-neutral-400 font-medium"
		/>
		<!-- Search icon on the right -->
		<div class="pr-4 pl-2 text-accent">
			<Search size={24} strokeWidth={2.5} />
		</div>
	</div>
</form>

<style>
	.glow-effect {
		position: absolute;
		inset: -4px;
		background: conic-gradient(from var(--angle), var(--accent), var(--secondary), var(--accent));
		border-radius: 1rem;
		filter: blur(8px);
		opacity: 0.3;
		transition: opacity 300ms ease;
		z-index: 0;
		animation: rotate-gradient 3s linear infinite;
	}

	@property --angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}

	@keyframes rotate-gradient {
		from {
			--angle: 0deg;
		}
		to {
			--angle: 360deg;
		}
	}

	.group:hover .glow-effect,
	.group:focus-within .glow-effect {
		opacity: 0.5;
		animation-play-state: paused;
	}

	/* 
	The shadcn Input component has styles that override the Tailwind classes.
	add a scoped CSS rule to target the input directly.
	*/
	div :global(input) {
		font-size: larger;
	}
</style>
