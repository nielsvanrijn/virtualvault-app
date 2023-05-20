<script lang="ts">
    import { fade } from 'svelte/transition'
    
    export let label: string | undefined = undefined
    export let id: string | undefined = undefined
    export let name: string
    export let type: 'text' | 'number' | 'email' | 'password'
    export let placeholder: string | undefined = undefined
    export let errors: {[key: string]: string[]} | undefined = undefined
    export let value: string | number | undefined = undefined

    function typeAction(node: HTMLInputElement) {
        node.type = type
    }
</script>
<div>
    {#if label}
        <label class="block mb-1 ml-1 text-sm font-medium leading-6 text-neutral-300" for={name}>{label}</label>
    {/if}
    <input
        {id}
        {name}
        class="block w-full rounded-md bg-black transition-colors border-px py-1.5 text-white shadow-sm border-neutral-500 placeholder:text-neutral-500 focus:border-white focus:ring-transparent"
        {placeholder}
        bind:value
        use:typeAction
    />
    {#if errors && errors[name]}
        <div class="flex flex-col" transition:fade="{{ duration: 200 }}">
            {#each errors[name] as error}
                <small class="ml-1 text-red-300">{error}</small>
            {/each}
        </div>
    {/if}
</div>