<script lang='ts'>
    import type { PageData } from './$types'
    import { enhance } from '$app/forms'
    import Button from '$lib/components/ui/Button.svelte'

    export let data: PageData
</script>
<div class="h-full">
    <nav class="flex justify-between">
        <a href="/home">Home</a>
        <form action="?/logout" method="post" use:enhance>
            <Button>Sign out</Button>
        </form>
    </nav>
    <div>
        <h1 class="text-4xl">Home</h1>
        <p class="mt-4">Dope! Your signed in.</p>
        <h3 class="text-xl font-black text-indigo-700">{data.yolo}</h3>
    </div>
</div>