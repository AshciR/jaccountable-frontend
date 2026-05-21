<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { Info } from 'lucide-svelte';

	let { reasoning }: { reasoning: string } = $props();
</script>

<Alert.Root class="border-green-100 border-l-4 border-l-accent-hover bg-background">
	<Info />
	<Alert.Description>
		<p class="leading-6 text-foreground" data-testid="analysis-reasoning">{reasoning}</p>
	</Alert.Description>
</Alert.Root>
