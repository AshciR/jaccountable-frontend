<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';

	const faqs = [
		{
			id: 'faq-1',
			question: 'What is JAccountable?',
			answer:
				'JAccountable is a free platform that helps Jamaicans keep track of government accountability stories — scandals, investigations, policy failures, and similar issues reported in the news. We gather and organize these stories in one place so you can see the full picture, follow how issues develop over time, and remember what happened when it matters most.'
		},
		{
			id: 'faq-2',
			question: 'Where does the information come from?',
			answer:
				'All content is sourced from established Jamaican newspapers and journalistic outlets. We only include factual news reporting — no editorials, opinion pieces, or commentary. This ensures the information remains objective and grounded in professional journalism.'
		},
		{
			id: 'faq-3',
			question: 'Is this platform affiliated with any political party or organization?',
			answer:
				"No. JAccountable is completely independent and non-partisan. We don't create or editorialize content — we simply gather and organize factual reporting from objective journalistic sources, regardless of which party or politician is involved."
		},
		{
			id: 'faq-4',
			question: 'What does "AI-powered" mean? Does AI write the articles?',
			answer:
				'No, AI does not write any articles. "AI-powered" refers to how we identify and categorize stories related to government accountability, such as scandals, investigations, or allegations of corruption. The AI helps us find relevant stories efficiently — but as with all responsible AI use, it\'s an assistive tool, not a replacement for human judgment or journalism.'
		},
		{
			id: 'faq-5',
			question: 'Is JAccountable free to use?',
			answer:
				'Yes, the platform is completely free to use. In the future, we may introduce paid features to help cover operational costs, but access to core functionality will remain available.'
		},
		{
			id: 'faq-6',
			question: 'Do you collect my data or track what I read?',
			answer:
				'We collect anonymous analytics data to help us understand how the platform is used and to guide product development. We do not track personally identifiable information or monitor individual reading habits.'
		},
		{
			id: 'faq-7',
			question: 'Why should I trust this over reading the news myself?',
			answer:
				"You shouldn't choose one over the other — JAccountable complements reading the news, it doesn't replace it. The platform makes it easier to track stories over time, see how issues connect, and maintain a record of what's been reported. Instead of manually keeping track of articles across months or years, we do that work for you."
		}
	];
</script>

<section id="faq" class="bg-background py-24 relative overflow-hidden">
	<!-- Decorative blur element -->
	<div
		class="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mt-48"
	></div>

	<div class="max-w-4xl mx-auto px-6">
		<!-- Header -->
		<div class="text-center mb-12">
			<span class="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block"> FAQ </span>

			<h2 class="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
				Frequently Asked Questions
			</h2>
		</div>

		<!-- Accordion -->
		<Accordion.Root type="single" class="space-y-4">
			{#each faqs as faq (faq.id)}
				<Accordion.Item value={faq.id}>
					<Accordion.Trigger class="text-left">
						{faq.question}
					</Accordion.Trigger>
					<Accordion.Content>
						<p class="text-neutral-500 leading-relaxed">
							{faq.answer}
						</p>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
</section>
