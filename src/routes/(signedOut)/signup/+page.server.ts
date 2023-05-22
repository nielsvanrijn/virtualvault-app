import { fail } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms/server'
import type { RegistrationResponseJSON, PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types'
import { eq } from 'drizzle-orm'
import type { PageServerLoad, Actions } from './$types'
import { emailSchema, webautnSchema } from '$lib/schema/signUpSchema'
import { finalizeRegister, initializeRegister } from '$lib/server/helpers/registerWebauthn'
import { db } from '$lib/db/db'
import { users } from '$lib/db/schema/users'

export const load = (async (event) => {
    const emailForm = await superValidate(event, emailSchema, { id: 'emailForm' })
    const webauthnForm = await superValidate(event, webautnSchema, { id: 'webauthnForm' })

    const code = event.url.searchParams.get('code')

    if (!code) return { emailForm, webauthnForm } // dont show err because someone coud try to guess the code
    
    // get user by code
    const user = await db.query.users.findFirst({ with: { authenticators: true }, where: eq(users.verificationCode, code) })

    if (!user) return { emailForm, webauthnForm } // show error?

    // do the webautn init call
    const creationOptionsJSON = initializeRegister(user)

    // strinyfy the creation options and send it to the client
    webauthnForm.data.PublicKeyCredentialCreationOptionsJSON = JSON.stringify(creationOptionsJSON)

    return { emailForm, webauthnForm }

}) satisfies PageServerLoad

export const actions = {
    email: async (event) => {
        const emailForm = await superValidate(event.request, emailSchema, { id: 'emailForm' })
    
        if (!emailForm.valid) return fail(400, { emailForm })

        const result = await event.locals.trpc.user.signUp(emailForm.data)
        
        if (result.error) return setError(emailForm, result.error.location, result.error.message)

        return message(emailForm, 'Email sent!')
    },
    webauthn: async (event) => {
        const webauthnForm = await superValidate(event.request, webautnSchema, { id: 'webauthnForm' })
    
        if (!webauthnForm.valid) return fail(400, { webauthnForm }) // show error?

        const RegistrationResponseJSON = JSON.parse(webauthnForm.data.RegistrationResponseJSON) as RegistrationResponseJSON
        const PublicKeyCredentialCreationOptionsJSON = JSON.parse(webauthnForm.data.PublicKeyCredentialCreationOptionsJSON) as PublicKeyCredentialCreationOptionsJSON

        // do the webautn finalize call
        const verification = await finalizeRegister(RegistrationResponseJSON, PublicKeyCredentialCreationOptionsJSON)

        if (!verification) return { webauthnForm } // show error?

        // upsert the user with the new credential
        const upsert = await event.locals.trpc.user.upsertUserCredential({ verification, userId: PublicKeyCredentialCreationOptionsJSON.user.id })

        if(!upsert) return { webauthnForm } // show error?

        // create key in lucia?
        // const key = await auth.useKey('webauthn', PublicKeyCredentialCreationOptionsJSON.user.name, null)
        
        // remove the code from the user
        await db.update(users).set({ verificationCode: null }).where(eq(users.id, PublicKeyCredentialCreationOptionsJSON.user.id))
        
        return message(webauthnForm, 'Successfully signed up 🎉')
    }
} satisfies Actions