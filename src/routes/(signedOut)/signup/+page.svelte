<script lang='ts'>
    import { superForm } from 'sveltekit-superforms/client'
    import Fa from 'svelte-fa/src/fa.svelte'
    import { fade } from 'svelte/transition'
    import { faXmark } from '@fortawesome/pro-solid-svg-icons'
    import { startRegistration } from '@simplewebauthn/browser'
    import type { PageData } from './$types'
    import Button from '$lib/components/ui/Button.svelte'
    import Card from '$lib/components/ui/Card.svelte'
    import Input from '$lib/components/ui/Input.svelte'
    import { browser } from '$app/environment'
  
    
    export let data: PageData

    const { form, message, errors, enhance } = superForm(data.emailForm, { invalidateAll: false })
    
    const { form: webauthnForm, enhance: webauthnEnhance, message: webauthnMessage } = superForm(data.webauthnForm, { invalidateAll: false })

    if ($webauthnForm.PublicKeyCredentialCreationOptionsJSON) {
        if (browser) {
            startRegistration(JSON.parse($webauthnForm.PublicKeyCredentialCreationOptionsJSON))
                .then((response) => {
                    // set the response
                    $webauthnForm.RegistrationResponseJSON = JSON.stringify(response)
                })
        // .catch((error) => {
                //     // set the error message
                //     $message = error.message
                // })
        }
    }
    
    async function dismiss() {
        $message = false
    }
</script>

<div class="grid h-full">
    <div class="m-auto w-fit">
        <Card title="Sign up">
            {#if !$webauthnForm.RegistrationResponseJSON}
                <form class="space-y-6" action="?/email" method="POST" use:enhance>
                    <div>
                        <Input name="email" errors={$errors} label="Email address" placeholder="example@email.com" type="text" bind:value={$form.email} />
                    </div>

                    <div>
                        <Button class="w-full">
                            Sign up
                        </Button>
                    </div>

                    <div class="flex justify-end w-full text-neutral-500">
                        Already have an account? <a class="ml-1 font-medium text-neutral-400 hover:text-white" href="/signin">Sign in</a>
                    </div>
                </form>
            {/if}

            {#if $webauthnForm.RegistrationResponseJSON}
                <form class="space-y-6" action="?/webauthn" method="POST" use:webauthnEnhance>
                    <div>
                        <input name="PublicKeyCredentialCreationOptionsJSON" type="hidden" bind:value={$webauthnForm.PublicKeyCredentialCreationOptionsJSON}>
                        <input name="RegistrationResponseJSON" type="hidden" bind:value={$webauthnForm.RegistrationResponseJSON}>
                    </div>

                    {#if $webauthnMessage}
                        <div>
                            <p>{$webauthnMessage}</p>
                        </div>
                    {/if}

                    <div>
                        {#if !$webauthnMessage}
                            <Button class="w-full">
                                Finish sign up
                            </Button>
                        {/if}
                        {#if $webauthnMessage}
                            <a class="relative z-10 block w-full px-4 py-2 m-auto text-center rounded btn2 h-fit before:hover:bg-neutral-950/80 before:transition-colors before:inset-[2px] before:rounded-sm before:bg-neutral-950 before:absolute before:-z-10" href="/signin">Go to sign in</a>
                        {/if}
                    </div>
                </form>
            {/if}
        </Card>
        {#if $message}
            <div class="flex justify-between px-4 py-2 mt-4 align-middle border rounded-lg hover:cursor-pointer group border-neutral-500 bg-gradient-to-r from-neutral-900" on:click={dismiss} on:keypress={dismiss} transition:fade="{{ duration: 200 }}">
                <span class="transition-colors group-hover:text-neutral-300">{$message}</span>
                <Fa class="my-auto transition-colors group-hover:text-neutral-300" icon={faXmark} size="sm" />
            </div>
        {/if}
    </div>
</div>