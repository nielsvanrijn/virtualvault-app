<script lang='ts'>
    import { superForm } from 'sveltekit-superforms/client'
    import { startAuthentication } from '@simplewebauthn/browser'
    import type { PageData } from './$types'
    import Button from '$lib/components/ui/Button.svelte'
    import Card from '$lib/components/ui/Card.svelte'
    import Input from '$lib/components/ui/Input.svelte'
    import { browser } from '$app/environment'
    
    export let data: PageData

    let formRef: HTMLFormElement

    const { form, errors, enhance } = superForm(data.form)

    console.log('1')
    form.subscribe(async (value) => {
        if (value.PublicKeyCredentialRequestOptionsJSON && !value.AuthenticationResponseJSON) {
            await startAuthentication(JSON.parse(value.PublicKeyCredentialRequestOptionsJSON))
                .then((response) => {
                    $form.AuthenticationResponseJSON = JSON.stringify(response)
                })
            console.log('3')
            formRef.requestSubmit() // TODO: also implement this in sign up
        }
    })
</script>

<div class="grid h-full">
    <div class="m-auto w-fit">
        <Card title="Sign in">
            <form bind:this={formRef} class="space-y-6" method="POST" use:enhance>
                <div>
                    <Input name="email" errors={$errors} label="Email address" placeholder="example@email.com" type="text" bind:value={$form.email} />
                    <input name="PublicKeyCredentialRequestOptionsJSON" type="hidden" bind:value={$form.PublicKeyCredentialRequestOptionsJSON}>
                    <input name="AuthenticationResponseJSON" type="hidden" bind:value={$form.AuthenticationResponseJSON}>
                </div>

                <div>
                    <Button class="w-full">
                        Sign in
                    </Button>
                </div>

                <div class="flex justify-end w-full text-neutral-500">
                    Don't have an account? <a class="ml-1 font-medium text-neutral-400 hover:text-white" href="/signup">Sign up</a>
                </div>
            </form>
        </Card>
    </div>
</div>