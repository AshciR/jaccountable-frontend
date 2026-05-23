<script lang="ts">
	import ChallengeSection from '$lib/components/features/about/ChallengeSection.svelte';
	import FAQSection from '$lib/components/features/about/FAQSection.svelte';
</script>

<svelte:head>
	<title>About — JAccountable</title>
	<meta
		name="description"
		content="JAccountable is an independent, non-partisan platform that gathers Jamaican accountability journalism in one searchable place so citizens can track stories over time."
	/>
</svelte:head>

<section class="py-24 px-6">
	<div class="max-w-4xl mx-auto">
		<span class="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
			About Us
		</span>
		<h1 class="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
			An independent record of Jamaican government accountability.
		</h1>
		<div class="space-y-6 text-lg text-neutral-500 leading-relaxed">
			<p>
				JAccountable is a free, non-partisan platform that gathers government accountability stories
				— scandals, investigations, policy failures, and similar issues — from established Jamaican
				news sources and organizes them in one searchable place.
			</p>
			<p>
				We don't write the news. We surface what professional journalists have already reported, so
				citizens, researchers, and journalists can follow how stories develop, see how issues
				connect, and remember what happened when it matters most.
			</p>
		</div>
	</div>
</section>

<ChallengeSection />
<FAQSection />
