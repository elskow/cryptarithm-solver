<script>
	import '../app.css';
	import '@fontsource-variable/plus-jakarta-sans';
	import '@fontsource-variable/fira-code';
	import '@fontsource-variable/noto-serif-tibetan';
</script>

<div class="bg-zinc-200 min-h-screen text-accent-foreground relative">
	<div
		class="absolute inset-0 h-full w-full bg-zinc-50 bg-[radial-gradient(#636466_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] z-0"
	></div>
	<div class="relative z-10">
		<slot></slot>
	</div>
</div>

<style>
    :global(body) {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
</style>