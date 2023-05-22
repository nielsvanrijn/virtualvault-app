import { TRPCError } from '@trpc/server'
import { t } from '$lib/server/trpc/t'

export const auth = t.middleware(async ({ next, ctx }) => {
    // if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    if (!ctx.auth) throw new TRPCError({ code: 'UNAUTHORIZED' })
    return next()
})