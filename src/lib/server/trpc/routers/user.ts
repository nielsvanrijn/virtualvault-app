import { eq } from 'drizzle-orm'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import type { VerifiedRegistrationResponse } from '@simplewebauthn/server/dist/registration/verifyRegistrationResponse'
import { logger } from '$lib/server/trpc/middleware/logger'
import { t } from '$lib/server/trpc/t'
import { db } from '$lib/db/db'
import { authenticators, users } from '$lib/db/schema/users'
import { emailSchema } from '$lib/schema/signUpSchema'
import { serverEnv } from '$lib/server/serverEnv'
import { verifyEmail } from '$lib/emails/verifyEmail'
import { auth } from '$lib/server/lucia'

function uint8ArrayToBase64String(uint8Array: Uint8Array) {
    return Buffer.from(uint8Array).toString('base64url')
}

export const userRouter = t.router({
    signIn: t.procedure
        .use(logger)
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const key = await auth.useKey('webauthn', input, null)
            const session = await auth.createSession(key.userId)
            ctx.event.locals.auth.setSession(session)
        }),
    signUp: t.procedure
        .use(logger)
        .input(emailSchema)
        .mutation(async ({ input }) => {
            // check if user exists
            const user = await db.query.users.findFirst({ where: eq(users.email, input.email) })
            
            // if user exists, return error
            if (user) {
                return { error: { location: 'email' as const, message: 'User already exists!' } }
            }

            // generate code
            const code = crypto.randomUUID()

            await auth.createUser({
                primaryKey: {
                    providerId: 'webauthn',
                    providerUserId: input.email,
                    password: null
                },
                attributes: {
                    email: input.email,
                    verificationCode: code
                }
            }).catch((err) => {
                console.log(err)
                return { error: { location: 'email' as const, message: 'Could not create user!' } }
            })

            // send email
            return nodemailer.createTransport({
                host: serverEnv.MAILTRAP_HOST,
                port: +serverEnv.MAILTRAP_PORT,
                auth: {
                    user: serverEnv.MAILTRAP_USER,
                    pass: serverEnv.MAILTRAP_PASS
                }
            }).sendMail({
                to: input.email,
                subject: 'Virtualvault | Please verify your email',
                html: verifyEmail(code)
            })
                .then(() => ({ error: null }))
                .catch((err) => {
                    console.log(err)
                    return { error: { location: 'email' as const, message: 'Could not send email!' } }
                })
            
        }),
    upsertUserCredential: t.procedure
        .use(logger)
        .input(z.custom<{verification: VerifiedRegistrationResponse, userId: string}>())
        .mutation(async ({ input }) => {
            if(!input.verification.registrationInfo) return false

            const credentialID = uint8ArrayToBase64String(input.verification.registrationInfo.credentialID)
            // TODO: catch error?
            
            // find authenticator by credentialID
            const authenticator = await db.query.authenticators.findFirst({ where: eq(authenticators.credentialID, credentialID) })
            // TODO: catch error?

            // if authenticator exists, update
            if (authenticator) {
                await db.update(authenticators).set({
                    credentialID: credentialID,
                    // credentialPublicKey: Buffer.from(input.verification.registrationInfo!.credentialPublicKey),
                    credentialPublicKey: uint8ArrayToBase64String(input.verification.registrationInfo.credentialPublicKey),
                    counter: input.verification.registrationInfo.counter,
                    credentialDeviceType: input.verification.registrationInfo.credentialDeviceType,
                    credentialBackedUp: input.verification.registrationInfo.credentialBackedUp,
                    userId: input.userId,
                }).where(eq(authenticators.credentialID, credentialID))
                // TODO: catch error?
                return true
            }

            // if authenticator does not exist, insert
            await db.insert(authenticators).values({
                credentialID: credentialID,
                // credentialPublicKey: Buffer.from(input.verification.registrationInfo!.credentialPublicKey),
                credentialPublicKey: uint8ArrayToBase64String(input.verification.registrationInfo.credentialPublicKey),
                counter: input.verification.registrationInfo.counter,
                credentialDeviceType: input.verification.registrationInfo.credentialDeviceType,
                credentialBackedUp: input.verification.registrationInfo.credentialBackedUp,
                userId: input.userId
            })
            // TODO: catch error?

            return true
        })

})