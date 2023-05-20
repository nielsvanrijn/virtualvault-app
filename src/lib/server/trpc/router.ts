import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { userRouter } from '$lib/server/trpc/routers/user'
import { t } from '$lib/server/trpc/t'

export const router = t.router({
    user: userRouter,
})

export type Router = typeof router;
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
export type CalledRouter = ReturnType<Router['createCaller']>;