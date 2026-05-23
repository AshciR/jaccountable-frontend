<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/jaccountable-logo.png';
	import { Menu, X } from 'lucide-svelte';

	let scrolled = $state(false);
	let menuOpen = $state(false);

	$effect(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 50;
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function scrollToSection(event: MouseEvent, sectionId: string) {
		event.preventDefault();
		menuOpen = false;
		if ($page.url.pathname === '/') {
			const element = document.getElementById(sectionId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		} else {
			goto(`/#${sectionId}`);
		}
	}
</script>

<header
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled || menuOpen
		? 'bg-surface/95 backdrop-blur-sm shadow-sm'
		: 'bg-transparent'}"
>
	<div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
		<!-- Logo and brand name -->
		<a href={resolve('/')} class="flex items-center gap-3">
			<img src={logo} alt="JAccountable Logo" class="h-8 w-auto" />
			<span class="font-bold text-lg tracking-wide text-primary"
				><span class="text-accent">J</span><span class="text-secondary">A</span>CCOUNTABLE</span
			>
		</a>

		<!-- Desktop Navigation -->
		<nav class="hidden md:block">
			<ul class="flex items-center gap-8">
				<li>
					<a
						href="/#search"
						onclick={(e) => scrollToSection(e, 'search')}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						SEARCH
					</a>
				</li>
				<li>
					<a
						href={resolve('/about')}
						onclick={() => (menuOpen = false)}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						ABOUT
					</a>
				</li>
				<li>
					<a
						href="/#how-it-works"
						onclick={(e) => scrollToSection(e, 'how-it-works')}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						HOW IT WORKS
					</a>
				</li>
				<li>
					<a
						href="/#share"
						onclick={(e) => scrollToSection(e, 'share')}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						SHARE
					</a>
				</li>
			</ul>
		</nav>

		<!-- Hamburger button (mobile only) -->
		<button
			class="md:hidden p-2 text-primary hover:text-accent transition-colors"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
		>
			{#if menuOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
	</div>

	<!-- Mobile dropdown menu -->
	{#if menuOpen}
		<div class="md:hidden border-t border-primary/10 px-6 py-4">
			<ul class="flex flex-col gap-4">
				<li>
					<a
						href="/#search"
						onclick={(e) => scrollToSection(e, 'search')}
						class="block text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						SEARCH
					</a>
				</li>
				<li>
					<a
						href={resolve('/about')}
						onclick={() => (menuOpen = false)}
						class="block text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						ABOUT
					</a>
				</li>
				<li>
					<a
						href="/#how-it-works"
						onclick={(e) => scrollToSection(e, 'how-it-works')}
						class="block text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						HOW IT WORKS
					</a>
				</li>
				<li>
					<a
						href="/#share"
						onclick={(e) => scrollToSection(e, 'share')}
						class="block text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						SHARE
					</a>
				</li>
			</ul>
		</div>
	{/if}
</header>
