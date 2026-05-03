<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
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

<div class="mt-8 flex justify-center items-center gap-1 text-sm" data-testid="topics-sort-toggle">
	<span class="text-muted-foreground">Topics:</span>
	<button
		type="button"
		class={topicSort === 'most_found'
			? 'cursor-pointer font-bold text-green-600 underline underline-offset-4'
			: 'cursor-pointer text-muted-foreground hover:text-green-600'}
		onclick={() => onSortChange('most_found')}
	>
		Most Mentioned
	</button>
	<span class="text-muted-foreground">·</span>
	<button
		type="button"
		class={topicSort === 'latest'
			? 'cursor-pointer font-bold text-green-600 underline underline-offset-4'
			: 'cursor-pointer text-muted-foreground hover:text-green-600'}
		onclick={() => onSortChange('latest')}
	>
		Recent
	</button>
</div>

<div class="mt-2 flex flex-wrap justify-center gap-2" data-testid="topics-bar">
	{#each topics as topic (topic.normalizedName)}
		<button type="button" onclick={() => onTopicClick(topic.name)}>
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
