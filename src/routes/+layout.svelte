<script>
    import Nav from '$lib/components/nav.svelte'
    import '../app.css'
</script>

<div class="h-full text-white bg-black">
    <Nav />
    <div class="block w-full h-full p-4 mx-auto xl:max-w-7xl">
        <slot />
    </div>
</div>
