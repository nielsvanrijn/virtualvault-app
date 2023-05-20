import { z } from 'zod'

export const emailSchema = z.object({
    email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
})

export const webautnSchema = z.object({
    PublicKeyCredentialCreationOptionsJSON: z.string(),
    RegistrationResponseJSON: z.string(),
})

export type emailSchemaType = typeof emailSchema;
export type webautnSchemaType = typeof webautnSchema;
