<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { resolve } from '$app/paths';
	import type { Article } from '$lib/api/types';
	import ArticleSourceHeader from '../ArticleSourceHeader.svelte';
	import AnalysisAlert from '../AnalysisAlert.svelte';

	let { article, onTopicClick }: { article: Article; onTopicClick?: (entity: string) => void } =
		$props();

	const classification = $derived(article.classifications[0]);

	type TextPart = { text: string; highlighted: boolean };
	type FocusedSentence = { text: string; parts: TextPart[] };
	type ExcerptResult = {
		sentences: FocusedSentence[];
		showLeading: boolean;
		showTrailing: boolean;
	};

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
	 * Extracts 5 sentences from fullText centered around the snippet match.
	 */
	function extractFocusedSentences(
		fullText: string | undefined,
		snippet: string | null
	): ExcerptResult {
		if (!snippet) {
			// No snippet (e.g. related articles) — show first sentences of fullText
			if (!fullText) return { sentences: [], showLeading: false, showTrailing: false };
			const all = splitIntoSentences(fullText);
			const window = all.slice(0, 5);
			return {
				sentences: window.map((text) => ({ text, parts: [{ text, highlighted: false }] })),
				showLeading: false,
				showTrailing: all.length > 5
			};
		}

		const normalized = snippet.replace(/<b>/gi, '<mark>').replace(/<\/b>/gi, '</mark>');
		const highlightWords = getHighlightedWords(normalized);
		const snippetText = normalized.replace(/<\/?mark>/gi, '');

		if (!fullText) {
			// Fallback to snippet if no fullText — always show trailing ellipsis
			return {
				sentences: [{ text: snippetText, parts: parseWithHighlights(snippetText, highlightWords) }],
				showLeading: false,
				showTrailing: true
			};
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

		return {
			sentences: focusedSentences.map((sentence) => ({
				text: sentence,
				parts: parseWithHighlights(sentence, highlightWords)
			})),
			showLeading: adjustedStart > 0,
			showTrailing: endIndex < sentences.length
		};
	}

	const excerpt = $derived(extractFocusedSentences(article.fullText, article.snippet));
</script>

<Card.Root
	class="relative overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:border-green-500"
>
	<Card.Header class="pb-3">
		<ArticleSourceHeader {article} />
	</Card.Header>

	<Card.Content class="space-y-4 px-4 sm:px-6">
		<!-- Title -->
		<div>
			<h3 class="text-lg font-semibold leading-tight text-card-foreground md:text-xl">
				<a
					href={resolve(`/articles/${article.id}`)}
					class="after:absolute after:inset-0 hover:underline hover:text-accent-hover"
				>
					{article.title}
				</a>
			</h3>
		</div>

		<!-- Excerpt -->
		<div>
			<h4 class="mb-1 text-sm font-semibold text-accent">Excerpt</h4>
			<div class="max-w-prose space-y-1 text-sm leading-relaxed text-muted-foreground">
				{#each excerpt.sentences as sentence, i (i)}
					<!-- prettier-ignore: inline blocks are intentional — whitespace between them appears as visible text -->
					<p data-testid="excerpt-sentence">
						{#if i === 0 && excerpt.showLeading}...
						{/if}{#each sentence.parts as part, partIndex (partIndex)}{#if part.highlighted}<span
									class="rounded bg-green-100 px-0.5">{part.text}</span
								>{:else}{part.text}{/if}{/each}{#if i === excerpt.sentences.length - 1 && excerpt.showTrailing}
							...{/if}
					</p>
				{/each}
			</div>
		</div>

		<!-- Analysis -->
		{#if classification?.reasoning}
			<AnalysisAlert reasoning={classification.reasoning} />
		{/if}

		<!-- Original Article Link -->
		<div class="relative z-10">
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
			<div class="relative z-10">
				<h4 class="mb-2 text-sm font-semibold text-accent">Mentioned</h4>
				<div class="flex flex-wrap gap-2">
					{#each article.entities as entity (entity)}
						<button
							class="rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
							onclick={() => onTopicClick?.(entity)}
						>
							{entity}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
