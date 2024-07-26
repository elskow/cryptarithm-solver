<script>
	import '../app.css';
	import '@fontsource-variable/plus-jakarta-sans';
</script>

<div class="bg-neutral-200 min-h-screen text-accent-foreground relative">
	<div
		class="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_4px,transparent_4px),linear-gradient(to_bottom,#80808012_4px,transparent_4px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] z-0"
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