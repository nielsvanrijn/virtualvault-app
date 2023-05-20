import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'
import * as users from './schema/users'
import { serverEnv } from '$lib/server/serverEnv'

// create the connection
export const connection = connect({
    host: serverEnv.DATABASE_HOST,
    username: serverEnv.DATABASE_USERNAME,
    password: serverEnv.DATABASE_PASSWORD,
})

export const db = drizzle(connection, { schema: { ...users } })