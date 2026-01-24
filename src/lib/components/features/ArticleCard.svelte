<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import type { Article } from '$lib/api/types';
	import gleanerIcon from '$lib/assets/gleaner-article-card-icon.png';
	import observerIcon from '$lib/assets/observer-article-card-icon.png';
	import fallbackIcon from '$lib/assets/fallback-article-card-icon.png';

	let { article }: { article: Article } = $props();

	const classification = $derived(article.classifications[0]);
	const confidenceDisplay = $derived(
		classification ? (classification.confidence * 10).toFixed(1) : null
	);

	// Confidence pill styling - color ranges from yellow (0.7) to green (1.0)
	const confidencePillClasses = $derived(() => {
		const base = 'inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold';
		if (!classification) return `${base} bg-neutral-50 text-neutral-600 border-neutral-200`;
		const confidence = classification.confidence;
		if (confidence >= 0.9) return `${base} bg-green-100 text-green-700 border-green-400`;
		if (confidence >= 0.8) return `${base} bg-green-50 text-green-500 border-green-200`;
		return `${base} bg-gold-50 text-gold-700 border-gold-200`;
	});

	// Format the published date
	const formattedDate = $derived(() => {
		const date = new Date(article.published_date);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	});

	const sourceIcon = $derived(
		article.news_source === 'JAMAICA_GLEANER'
			? gleanerIcon
			: article.news_source === 'JAMAICA_OBSERVER'
				? observerIcon
				: fallbackIcon
	);

	const sourceName = $derived(
		article.news_source === 'JAMAICA_GLEANER'
			? 'Jamaica Gleaner'
			: article.news_source === 'JAMAICA_OBSERVER'
				? 'Jamaica Observer'
				: 'Source'
	);

	type TextPart = { text: string; highlighted: boolean };
	type FocusedSentence = { text: string; parts: TextPart[] };

	/**
	 * Extracts highlighted words from a snippet containing `<mark>` tags.
	 */
	function getHighlightedWords(snippet: string): string[] {
		const regex = /<mark>(.*?)<\/mark>/gi;
		const words: string[] = [];
		let match;
		while ((match = regex.exec(snippet)) !== null) {
			words.push(match[1]);
		}
		return words;
	}

	/**
	 * Escapes special regex characters in a string.
	 */
	function escapeRegex(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	/**
	 * Parses a sentence and highlights specified words.
	 * Returns array of TextPart objects for safe rendering without innerHTML.
	 */
	function parseWithHighlights(text: string, highlightWords: string[]): TextPart[] {
		if (highlightWords.length === 0) {
			return [{ text, highlighted: false }];
		}

		const parts: TextPart[] = [];
		const pattern = new RegExp(`(${highlightWords.map((w) => escapeRegex(w)).join('|')})`, 'gi');
		let lastIndex = 0;
		let match;

		while ((match = pattern.exec(text)) !== null) {
			if (match.index > lastIndex) {
				parts.push({ text: text.slice(lastIndex, match.index), highlighted: false });
			}
			parts.push({ text: match[0], highlighted: true });
			lastIndex = pattern.lastIndex;
		}

		if (lastIndex < text.length) {
			parts.push({ text: text.slice(lastIndex), highlighted: false });
		}

		return parts.length > 0 ? parts : [{ text, highlighted: false }];
	}

	/**
	 * Splits text into sentences using common sentence-ending punctuation.
	 */
	function splitIntoSentences(text: string): string[] {
		return text
			.split(/(?<=[.!?])\s+/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	}

	/**
	 * Extracts 5 sentences from full_text centered around the snippet match.
	 * The middle sentence has full opacity, outer sentences fade progressively.
	 */
	function extractFocusedSentences(
		fullText: string | undefined,
		snippet: string
	): FocusedSentence[] {
		const highlightWords = getHighlightedWords(snippet);
		const snippetText = snippet.replace(/<\/?mark>/gi, '');

		if (!fullText) {
			// Fallback to snippet if no full_text
			return [
				{
					text: snippetText,
					parts: parseWithHighlights(snippetText, highlightWords)
				}
			];
		}

		const sentences = splitIntoSentences(fullText);

		// Find sentence matching the snippet
		let matchIndex = sentences.findIndex((s) => s.includes(snippetText));
		if (matchIndex === -1) {
			// Fallback: find sentence containing any highlighted word
			matchIndex = sentences.findIndex((s) =>
				highlightWords.some((word) => s.toLowerCase().includes(word.toLowerCase()))
			);
		}
		if (matchIndex === -1) matchIndex = Math.floor(sentences.length / 2);

		// Extract 5 sentences centered around match (2 before, match, 2 after)
		const startIndex = Math.max(0, matchIndex - 2);
		const endIndex = Math.min(sentences.length, startIndex + 5);
		const adjustedStart = Math.max(0, endIndex - 5);

		const focusedSentences = sentences.slice(adjustedStart, endIndex);

		return focusedSentences.map((sentence) => ({
			text: sentence,
			parts: parseWithHighlights(sentence, highlightWords)
		}));
	}

	const focusedSentences = $derived(extractFocusedSentences(article.full_text, article.snippet));
</script>

<Card.Root class="overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md">
	<Card.Header class="pb-3">
		<div class="flex items-start justify-between gap-4">
			<!-- Left: Source + Date + Badge -->
			<div class="flex items-center gap-3">
				<img
					src={sourceIcon}
					alt={sourceName}
					class="h-9 w-9 rounded-sm object-cover"
					loading="lazy"
				/>
				<div>
					<div class="text-sm font-medium text-muted-foreground">{sourceName}</div>
					<time datetime={article.published_date} class="text-xs text-muted-foreground">
						{formattedDate()}
					</time>
					{#if classification}
						<Badge variant="destructive" class="mt-1 block w-fit capitalize">
							{classification.classifierType.toLowerCase()}
						</Badge>
					{/if}
				</div>
			</div>

			<!-- Right: Confidence pill -->
			{#if confidenceDisplay}
				<span class={confidencePillClasses()}>
					Confidence <strong class="ml-1">{confidenceDisplay}</strong>
				</span>
			{/if}
		</div>
	</Card.Header>

	<Card.Content class="space-y-4 px-4 sm:px-6">
		<!-- Title -->
		<div>
			<h3 class="text-lg font-semibold leading-tight text-card-foreground md:text-xl">
				{article.title}
			</h3>
		</div>

		<!-- Excerpt -->
		<div>
			<h4 class="mb-1 text-sm font-semibold text-neutral-500">Excerpt</h4>
			<div class="max-w-prose space-y-1 text-sm leading-relaxed text-muted-foreground">
				{#each focusedSentences as sentence, index (index)}
					<p>
						{#each sentence.parts as part, index (index)}
							{#if part.highlighted}
								<span class="rounded bg-green-100 px-0.5">{part.text}</span>
							{:else}
								{part.text}
							{/if}
						{/each}
					</p>
				{/each}
			</div>
		</div>

		<!-- Original Article Link -->
		<div>
			<!-- eslint-disable svelte/no-navigation-without-resolve -- External link -->
			<a
				href={article.url}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm font-medium text-primary underline hover:text-accent-hover"
			>
				Read original article
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</div>

		<!-- Mentioned Entities -->
		{#if article.entities.length > 0}
			<div>
				<h4 class="mb-2 text-sm font-semibold text-neutral-500">Mentioned</h4>
				<div class="flex flex-wrap gap-2">
					{#each article.entities as entity (entity)}
						<span
							class="rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						>
							{entity}
						</span>
					{/each}
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
