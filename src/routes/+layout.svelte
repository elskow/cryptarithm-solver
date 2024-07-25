<script>
	import '../app.css';
	import '@fontsource-variable/plus-jakarta-sans';
</script>

<div class="bg-accent min-h-screen text-accent-forground">
	<slot></slot>
</div>

<style>
    :global(body) {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
</style>