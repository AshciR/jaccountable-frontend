<script lang="ts">
	import { resolve } from '$app/paths';
	import logo from '$lib/assets/jaccountable-logo.png';
	import { Button } from '$lib/components/ui/button';
</script>

<main class="min-h-screen flex flex-col items-center justify-center px-4">
	<div class="max-w-2xl w-full text-center flex flex-col items-center">
		<div class="mb-10 relative">
			<div class="animate-rocking inline-block">
				<img
					src={logo}
					alt="JAccountable Logo"
					class="w-[120px] h-[120px] md:w-[160px] md:h-[160px]"
				/>
			</div>
			<div
				class="absolute -bottom-2 -right-2 bg-secondary text-foreground font-display font-bold px-3 py-1 rounded-full text-sm shadow-sm rotate-12"
			>
				404
			</div>
		</div>

		<div class="space-y-4 mb-10">
			<h1 class="text-4xl md:text-5xl font-bold text-foreground leading-tight font-display">
				Hush Yaw, cyaan find it
			</h1>
			<p class="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
				The story you're looking for might have moved or doesn't exist.
			</p>
		</div>

		<Button
			href={resolve('/')}
			class="px-10 py-4 h-auto font-bold text-white bg-accent hover:bg-accent/90 rounded-button transition-all duration-300 hover:scale-[1.02] shadow-md"
		>
			Return to Home
		</Button>

		<div class="mt-24 pt-8 border-t border-border w-full opacity-40">
			<p class="text-xs text-muted-foreground font-medium tracking-[0.2em] uppercase">
				JAccountable &bull; Monitoring Governance
			</p>
		</div>
	</div>
</main>

<div class="fixed top-0 left-0 w-full h-1 bg-linear-to-r from-accent via-secondary to-accent"></div>

<style>
	@keyframes rocking {
		0% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(8deg);
		}
		75% {
			transform: rotate(-8deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}

	.animate-rocking {
		animation: rocking 1s ease-in-out forwards;
	}
</style>
