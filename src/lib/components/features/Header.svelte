<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/jaccountable-logo.png';

	let scrolled = $state(false);

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
		if ($page.url.pathname === '/') {
			const element = document.getElementById(sectionId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		} else {
			goto(resolve(`/#${sectionId}`));
		}
	}
</script>

<header
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled
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

		<!-- Navigation -->
		<nav>
			<ul class="flex items-center gap-8">
				<li>
					<a
						href={resolve('/#why')}
						onclick={(e) => scrollToSection(e, 'why')}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						WHY
					</a>
				</li>
				<li>
					<a
						href={resolve('/#search')}
						onclick={(e) => scrollToSection(e, 'search')}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						SEARCH
					</a>
				</li>
				<li>
					<a
						href={resolve('/#how-it-works')}
						onclick={(e) => scrollToSection(e, 'how-it-works')}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						HOW IT WORKS
					</a>
				</li>
				<li>
					<a
						href={resolve('/#faq')}
						onclick={(e) => scrollToSection(e, 'faq')}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						FAQ
					</a>
				</li>
				<li>
					<a
						href={resolve('/#share')}
						onclick={(e) => scrollToSection(e, 'share')}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						SHARE
					</a>
				</li>
			</ul>
		</nav>
	</div>
</header>
