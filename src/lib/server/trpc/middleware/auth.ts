import { t } from '$lib/server/trpc/t';
import { TRPCError } from '@trpc/server';

export const auth = t.middleware(async ({ next, ctx }) => {
    // if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    if (!ctx.auth) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next();
});