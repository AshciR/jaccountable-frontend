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

<div class="mt-8 flex items-center gap-2 text-base" data-testid="topics-sort-toggle">
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
	<span class="text-muted-foreground shrink-0 px-1">|</span>
	<div class="topics-scroll flex gap-2 overflow-x-auto" data-testid="topics-bar">
		{#each topics as topic (topic.normalizedName)}
			<button type="button" onclick={() => onTopicClick(topic.name)} class="shrink-0">
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
	</div>
</div>
