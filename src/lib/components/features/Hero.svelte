<script lang="ts">
	// Hero section for JAccountable landing page
</script>

<section
	class="relative h-screen w-full overflow-hidden flex items-center justify-center bg-linear-to-b from-background to-neutral-300"
>
	<div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
		<!-- Main headline -->
		<h1
			class="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-12 tracking-tight text-primary opacity-0 animate-slide-up"
		>
			Every <span class="gradient-text">Scandal.</span><br />
			Every <span class="gradient-text">Investigation.</span><br />
			One <span class="gradient-text">Place.</span>
		</h1>

		<!-- Animated vertical line -->
		<div class="flex justify-center opacity-0 animate-fade-in-delayed">
			<div
				class="w-1 h-24 rounded-full bg-linear-to-b from-accent to-transparent animate-pulse"
			></div>
		</div>
	</div>
</section>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(40px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-slide-up {
		animation: slideUp 1s ease-out forwards 0.8s;
	}

	.animate-fade-in-delayed {
		animation: fadeIn 1s ease-out forwards 1.2s;
	}

	.gradient-text {
		background: linear-gradient(to right, var(--color-accent), var(--color-secondary));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
</style>
