<script lang="ts">
	import { resolve } from '$app/paths';
	import logo from '$lib/assets/jacountable-logo.svg';

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
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
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
						href="#why"
						onclick={(e) => scrollToSection(e, 'why')}
						class="text-sm font-semibold tracking-[0.15em] uppercase text-primary hover:text-accent transition-colors"
					>
						WHY
					</a>
				</li>
			</ul>
		</nav>
	</div>
</header>
