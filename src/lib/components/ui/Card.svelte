<script lang="ts">
    export let title: string | undefined = undefined
</script>
<div class="{title ? 'pt-6' : ''} p-8 bg-black border rounded-lg shadow bg-gradient-to-b from-neutral-950 gradien border-neutral-500 min-w-[500px]">
    {#if title}
        <h1 class="mb-6 text-3xl font-semibold">{title}</h1>
    {/if}
    <slot/>
</div>