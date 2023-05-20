import { z } from 'zod'

export const signInSchema = z.object({
    email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
    PublicKeyCredentialRequestOptionsJSON: z.string(),
    AuthenticationResponseJSON: z.string().optional(),
})

export type signInSchemaType = typeof signInSchema;
