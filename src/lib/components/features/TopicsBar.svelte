<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import type { EntitySummary } from '$lib/api/types';

	let {
		topics,
		onTopicClick
	}: {
		topics: EntitySummary[];
		onTopicClick: (name: string) => void;
	} = $props();
</script>

<div class="mt-4 flex flex-wrap justify-center gap-2" data-testid="topics-bar">
	{#each topics as topic (topic.normalized_name)}
		<button type="button" onclick={() => onTopicClick(topic.name)}>
			<Badge
				variant="outline"
				class="cursor-pointer rounded-md text-muted-foreground border-muted-foreground hover:bg-green-400 hover:text-accent-foreground hover:border-transparent"
			>
				{topic.name}
			</Badge>
		</button>
	{/each}
</div>
