import { fail, redirect } from '@sveltejs/kit'
import { setError, superValidate } from 'sveltekit-superforms/server'
import type { AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types'
import { eq } from 'drizzle-orm'
import type { PageServerLoad, Actions } from './$types'
import { signInSchema } from '$lib/schema/signInSchema'
import { finalizeAuthentication, initializeAuthentication } from '$lib/server/helpers/authenticateWebauthn'
import { db } from '$lib/db/db'
import { users } from '$lib/db/schema/users'

export const load = (async (event) => {
    const form = await superValidate(event, signInSchema)

    return { form }

}) satisfies PageServerLoad

export const actions = {
    default: async (event) => {
        const form = await superValidate(event, signInSchema)

        if (!form.valid) return fail(400, {form})

        // get user by email
        const user = await db.query.users.findFirst({ with: { authenticators: true }, where: eq(users.email, form.data.email) })

        if (!user) return { form }

        // check if second submit (with AuthenticationResponseJSON)
        if (form.data.AuthenticationResponseJSON) {

            console.log('4')
            
            const PublicKeyCredentialRequestOptionsJSON = JSON.parse(form.data.PublicKeyCredentialRequestOptionsJSON) as PublicKeyCredentialRequestOptionsJSON
            const AuthenticationResponseJSON = JSON.parse(form.data.AuthenticationResponseJSON) as AuthenticationResponseJSON

            // do the webautn finalize call
            const success = await finalizeAuthentication(PublicKeyCredentialRequestOptionsJSON, AuthenticationResponseJSON, user)

            if (!success) return { form }

            // set cookie
            await event.locals.trpc.user.signIn(user.email)
            
            // redirect to welcome page
            throw redirect(302, '/')
        }

        // do the webautn init call
        const RequestOptionsJSON = initializeAuthentication(user)

        form.data.PublicKeyCredentialRequestOptionsJSON = JSON.stringify(RequestOptionsJSON)

        console.log('2')

        return { form }
    }
} satisfies Actions