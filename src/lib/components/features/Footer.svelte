<script lang="ts">
	import logo from '$lib/assets/jaccountable-logo.png';
	import { openContactForm } from '$lib/utils/contact';
	import { resolve } from '$app/paths';
</script>

<footer class="bg-muted border-t border-border">
	<div class="max-w-7xl mx-auto px-6 py-12">
		<!-- Desktop Layout (flex row) -->
		<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
			<!-- Left: Logo + Brand Name + Copyright + Credits -->
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-3">
					<img src={logo} alt="JAccountable Logo" class="h-8 w-auto" />
					<span class="font-bold text-lg tracking-wide text-primary" data-testid="brand-name">
						<span class="text-accent">J</span><span class="text-secondary">A</span><span
							>CCOUNTABLE</span
						>
					</span>
				</div>
				<div class="flex flex-col gap-2 text-sm text-muted-foreground">
					<p>© 2026 JACCOUNTABLE</p>
					<p class="text-xs">
						Logo by <a
							href="https://spritewrench.com/"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-accent transition-colors duration-200 underline">spritewrench.com</a
						>
					</p>
				</div>
			</div>

			<!-- Right: Navigation Links -->
			<nav>
				<ul class="flex flex-col md:flex-row gap-4 md:gap-8">
					<li>
						<a
							href={resolve('/privacy')}
							class="uppercase text-muted-foreground hover:text-accent transition-colors duration-200 font-medium tracking-wide text-sm"
						>
							PRIVACY
						</a>
					</li>
					<li>
						<button
							onclick={openContactForm}
							class="uppercase text-muted-foreground hover:text-accent transition-colors duration-200 font-medium tracking-wide text-sm"
						>
							CONTACT
						</button>
					</li>
				</ul>
			</nav>
		</div>

		<!-- Bottom: Slogan (separator line above) -->
		<div class="mt-12 pt-8 text-center">
			<p class="text-xs text-muted-foreground font-medium tracking-[0.2em] uppercase opacity-60">
				JAccountable &bull; Monitoring Governance
			</p>
		</div>
	</div>
</footer>
