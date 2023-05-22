<script lang='ts'>
    import type { PageData } from './$types'
    import { enhance } from '$app/forms'
    import Button from '$lib/components/ui/Button.svelte'

    export let data: PageData
    console.log(data)
</script>
<div class="h-full">
    <!-- <form action="?/logout" method="post" use:enhance>
        <Button>Sign out</Button>
    </form> -->

    <!-- searchbar -->
    <!-- filter? -->
    
    <div class="flex">

    </div>

    <!-- <div class="grid h-full">
        <div class="relative z-10 px-4 py-2 m-auto rounded-lg h-[1000px] bg-gradient-to-br from-zinc-500 to-zinc-800 before:inset-[2px] before:rounded-md before:bg-zinc-950 before:absolute before:-z-10 w-[500px]"></div>
    </div> -->
</div>