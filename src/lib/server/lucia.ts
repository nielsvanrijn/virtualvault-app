import lucia from 'lucia-auth'
import { sveltekit } from 'lucia-auth/middleware'
import { planetscale } from '@lucia-auth/adapter-mysql'
import { serverEnv } from './serverEnv'
import { logging } from './logging'
import { connection } from '$lib/db/db'

logging.info('Server Environment:', serverEnv)

export const auth = lucia({
    adapter: planetscale(connection),
    env: serverEnv.LUCIADEV,
    middleware: sveltekit(),
    transformDatabaseUser: (userData) => {
        return {
            userId: userData.id,
            username: userData.username
        }
    },
    origin: serverEnv.ORIGINS
})

export type Auth = typeof auth;
