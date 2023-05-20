import { z } from 'zod'
import { env } from '$env/dynamic/private'
import { dev } from '$app/environment'

const serverEnvValidation = z
    .object({
        ORIGIN: z.string().url().optional(),
        HTTPS: z.coerce.boolean(),
        DEV: z.coerce.boolean(),
        DEV_OVERRIDE: z.coerce.boolean().optional().default(false),
        CSRF_CHECK_ORIGIN: z.coerce.boolean(),
        LOGGING: z.coerce.boolean().optional(),
        LOGGING_CLASSES: z
            .string()
            .optional()
            .default('ERROR,WARN,INFO')
            .transform((data) => data.split(',').map((d) => d.trim().toUpperCase())),
        DATABASE_HOST: z.string(),
        DATABASE_USERNAME: z.string(),
        DATABASE_PASSWORD: z.string(),
        MAILTRAP_HOST: z.string(),
        MAILTRAP_PORT: z.string(),
        MAILTRAP_USER: z.string(),
        MAILTRAP_PASS: z.string(),
        APP_URL: z.string(),
        RPID: z.string(),
        RPNAME: z.string(),
    })
    .transform((data) => {
        const isDev = data.DEV || data.DEV_OVERRIDE
        return {
            ...data,
            LOGGING: data.DEV ? true : data.LOGGING,
            DEV: isDev,
            LUCIADEV: (isDev ? 'DEV' : 'PROD') as 'DEV' | 'PROD',
            ORIGINS: data.ORIGIN ? data.ORIGIN.split(',') : undefined,
            // MAILTRAP_HOST: isDev ? env.MAILTRAP_TESTING_HOST : env.MAILTRAP_HOST,
            // MAILTRAP_PORT: isDev ? +env.MAILTRAP_TESTING_PORT : +env.MAILTRAP_PORT,
            // MAILTRAP_USER: isDev ? env.MAILTRAP_TESTING_USER : env.MAILTRAP_USER,
            // MAILTRAP_PASS: isDev ? env.MAILTRAP_TESTING_PASS : env.MAILTRAP_PASS,
            // APP_URL: isDev ? env.APP_URL_TESTING : env.APP_URL,
        }
    })

export const serverEnv = serverEnvValidation.parse({
    ORIGIN: env.ORIGIN,
    HTTPS: env.HTTPS,
    DEV: dev,
    DEV_OVERRIDE: env.DEV,
    CSRF_CHECK_ORIGIN: env.CSRF_CHECK_ORIGIN,
    DEBUG: env.DEBUG,
    DEBUG_CLASSES: env.DEBUG_CLASSES,
    DATABASE_HOST: env.DATABASE_HOST,
    DATABASE_USERNAME: env.DATABASE_USERNAME,
    DATABASE_PASSWORD: env.DATABASE_PASSWORD,

    MAILTRAP_HOST: env.MAILTRAP_HOST,
    MAILTRAP_PORT: env.MAILTRAP_PORT,
    MAILTRAP_USER: env.MAILTRAP_USER,
    MAILTRAP_PASS: env.MAILTRAP_PASS,

    APP_URL: env.APP_URL,

    RPID: env.RPID,
    RPNAME: env.RPNAME
})
