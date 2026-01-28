<script lang="ts">
	import { Bookmark, Share2, Check, MessageCircle } from 'lucide-svelte';
	import whatsappLogo from '$lib/assets/whatsapp-logo-green.png';
	import xLogo from '$lib/assets/x-logo-black.png';

	// Reactive state
	let copied = $state(false);
	let showBookmarkTooltip = $state(false);

	// Share message and URL
	const shareMessage =
		'Want to keep track of government accountability in Jamaica? Check out JAccountable.';
	const shareUrl = $derived(typeof window !== 'undefined' ? window.location.href : '');
	const encodedUrl = $derived(encodeURIComponent(shareUrl));
	const encodedMessage = $derived(encodeURIComponent(shareMessage));

	// Share action handlers
	function shareOnWhatsApp() {
		const whatsappText = `${shareMessage} ${shareUrl}`;
		window.open(
			`https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
			'_blank',
			'noopener,noreferrer'
		);
	}

	function shareOnTwitter() {
		window.open(
			`https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
			'_blank',
			'noopener,noreferrer'
		);
	}

	function toggleBookmarkTooltip() {
		showBookmarkTooltip = !showBookmarkTooltip;
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function openFeedbackForm() {
		const userFeedbackLink = 'https://forms.gle/nVwg2J3pQVBiPwuJ7';
		window.open(userFeedbackLink, '_blank', 'noopener,noreferrer');
	}

	// Platform detection for bookmark shortcut
	const isMac = $derived(typeof navigator !== 'undefined' && navigator.platform.includes('Mac'));
</script>

<section id="share" class="bg-surface py-24 relative overflow-hidden">
	<div class="max-w-4xl mx-auto px-6 text-center relative z-10">
		<!-- Section Label -->
		<span class="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
			SPREAD THE WORD
		</span>

		<!-- Heading -->
		<h2 class="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
			Find this useful?
		</h2>

		<!-- Subheading -->
		<p class="text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-12">
			Share it with someone who'd want to know.
		</p>

		<!-- Share Options Grid -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
			<!-- WhatsApp Share -->
			<button
				onclick={shareOnWhatsApp}
				class="group relative flex flex-col items-center gap-3 p-6 rounded-lg bg-surface border border-neutral-200 hover:border-accent hover:shadow-md transition-all duration-200"
				aria-label="Share on WhatsApp"
			>
				<div
					class="relative w-12 h-12 flex items-center justify-center rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors"
				>
					<img src={whatsappLogo} alt="" class="w-7 h-7" />
				</div>
				<span class="text-sm font-medium text-primary">WhatsApp</span>
			</button>

			<!-- Twitter/X Share -->
			<button
				onclick={shareOnTwitter}
				class="group relative flex flex-col items-center gap-3 p-6 rounded-lg bg-surface border border-neutral-200 hover:border-accent hover:shadow-md transition-all duration-200"
				aria-label="Share on Twitter"
			>
				<div
					class="relative w-12 h-12 flex items-center justify-center rounded-full bg-neutral-800/10 group-hover:bg-neutral-800/20 transition-colors"
				>
					<img src={xLogo} alt="" class="w-6 h-6" />
				</div>
				<span class="text-sm font-medium text-primary">Twitter</span>
			</button>

			<!-- Bookmark -->
			<button
				onclick={toggleBookmarkTooltip}
				class="group relative flex flex-col items-center gap-3 p-6 rounded-lg bg-surface border border-neutral-200 hover:border-secondary hover:shadow-md transition-all duration-200"
				aria-label="Bookmark this page"
			>
				<div
					class="relative w-12 h-12 flex items-center justify-center rounded-full bg-secondary/15 group-hover:bg-secondary/25 transition-colors"
				>
					<Bookmark class="w-6 h-6 text-secondary-foreground" />
				</div>
				<span class="text-sm font-medium text-primary">Bookmark</span>
				{#if showBookmarkTooltip}
					<span class="absolute -bottom-10 text-xs text-neutral-500 whitespace-nowrap">
						Press {isMac ? 'Cmd+D' : 'Ctrl+D'}
					</span>
				{/if}
			</button>

			<!-- Copy URL -->
			<button
				onclick={copyToClipboard}
				class="group relative flex flex-col items-center gap-3 p-6 rounded-lg bg-surface border border-neutral-200 hover:border-accent hover:shadow-md transition-all duration-200"
				aria-label="Copy URL to clipboard"
			>
				<div
					class="relative w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors"
				>
					{#if copied}
						<Check class="w-6 h-6 text-accent" />
					{:else}
						<Share2 class="w-6 h-6 text-accent" />
					{/if}
				</div>
				<span class="text-sm font-medium text-primary">
					{copied ? 'URL Copied!' : 'Share'}
				</span>
			</button>
		</div>

		<!-- Feedback Subheading -->
		<p class="text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto mt-16 mb-8">
			Do you have feedback?
		</p>

		<!-- Feedback Button -->
		<div class="flex justify-center">
			<button
				onclick={openFeedbackForm}
				class="group relative flex flex-col items-center gap-3 px-8 py-4 rounded-lg bg-surface border border-neutral-200 hover:border-secondary hover:shadow-md transition-all duration-200"
				aria-label="Open feedback form"
			>
				<div
					class="relative w-12 h-12 flex items-center justify-center rounded-full bg-secondary/15 group-hover:bg-secondary/20 transition-colors"
				>
					<MessageCircle class="w-6 h-6 text-secondary-foreground" />
				</div>
				<span class="text-sm font-medium text-primary">Tell us what you think</span>
			</button>
		</div>
	</div>
</section>
