<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { TrendingUp, Sparkles } from 'lucide-svelte';
	import type { EntitySummary, EntitySortOrder } from '$lib/api/types';

	let {
		topics,
		selectedTopic,
		topicSort,
		onTopicClick,
		onSortChange
	}: {
		topics: EntitySummary[];
		selectedTopic: string | null;
		topicSort: EntitySortOrder;
		onTopicClick: (name: string) => void;
		onSortChange: (sort: EntitySortOrder) => void;
	} = $props();
</script>

<div
	class="mt-8 flex flex-col gap-4 text-base sm:flex-row sm:items-center"
	data-testid="topics-sort-toggle"
>
	<div class="flex shrink-0 items-center gap-2 justify-center sm:justify-start">
		<span class="text-muted-foreground shrink-0">Topics:</span>
		<button
			type="button"
			class={topicSort === 'latest'
				? 'inline-flex items-center gap-1 cursor-pointer font-bold text-green-600 underline underline-offset-4 shrink-0'
				: 'inline-flex items-center gap-1 cursor-pointer text-muted-foreground hover:text-green-600 shrink-0'}
			onclick={() => onSortChange('latest')}
		>
			<Sparkles class="size-4" />
			New
		</button>
		<span class="text-muted-foreground shrink-0">·</span>
		<button
			type="button"
			class={topicSort === 'most_found'
				? 'inline-flex items-center gap-1 cursor-pointer font-bold text-green-600 underline underline-offset-4 shrink-0'
				: 'inline-flex items-center gap-1 cursor-pointer text-muted-foreground hover:text-green-600 shrink-0'}
			onclick={() => onSortChange('most_found')}
		>
			<TrendingUp class="size-4" />
			Top
		</button>
	</div>
	<span class="text-muted-foreground hidden px-1 sm:block">|</span>
	<div class="topics-scroll flex gap-2 overflow-x-auto" data-testid="topics-bar">
		{#key topicSort}
			{#each topics as topic, index (topic.normalizedName)}
				<button
					type="button"
					onclick={() => onTopicClick(topic.name)}
					class="shrink-0 opacity-0 animate-fade-in"
					style="animation-delay: {index * 0.05}s;"
				>
					<Badge
						variant={selectedTopic === topic.name ? 'default' : 'outline'}
						class={selectedTopic === topic.name
							? 'cursor-pointer rounded-md bg-green-500 text-white border-transparent'
							: 'cursor-pointer rounded-md text-muted-foreground border-muted-foreground hover:bg-green-400 hover:text-accent-foreground hover:border-transparent'}
					>
						{topic.name}
					</Badge>
				</button>
			{/each}
		{/key}
	</div>
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animate-fade-in {
		animation: fadeIn 0.3s ease-in forwards;
	}
</style>
