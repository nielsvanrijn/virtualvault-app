import { createContext } from '$lib/server/trpc/context'
import { router } from '$lib/server/trpc/router'
import type { Handle } from '@sveltejs/kit'
import { createTRPCHandle } from 'trpc-sveltekit'
import { sequence } from '@sveltejs/kit/hooks'
import { auth } from './lib/server/lucia'

// function redirect(location: string, body?: string) {
//     return new Response(body, {
//         status: 303,
//         headers: { location }
//     });
// }

// const unProtectedRoutes: string[] = [
//     '/welcome',
//     '/login',
//     '/register',
//     '/api/auth',
// ];

// const auth = (async ({ event, resolve }) => {
//     // get cookies from browser
//     const session = event.cookies.get('session');
//     if (!session && !unProtectedRoutes.includes(event.url.pathname)) return redirect('/login', 'No authenticated user.');

//     // if (!session) {
//     //     throw redirect(303, '/login')
//     // }

//     // find the user based on the session
//     // const user = await db.user.findUnique({
//     //     where: { userAuthToken: session },
//     //     select: { username: true, role: true },
//     // })

//     // if `user` exists set `events.local`
//     // if (user) {
//     //     event.locals.user = {
//     //         name: user.username,
//     //         role: user.role.name,
//     //     }
//     // }

//     // load page as normal
//     return await resolve(event)
// }) satisfies Handle;

// // export const handle: Handle = sequence(auth, createTRPCHandle({ router, createContext, onError: ({ type, path, error }) => console.error(`Encountered error while trying to process ${type} @ ${path}:`, error) }));

// export const handle: Handle = createTRPCHandle({
//     router,
//     createContext,
//     onError: ({ type, path, error }) => console.error(`Encountered error while trying to process ${type} @ ${path}:`, error)
// });

const authHandler: Handle = async ({ event, resolve }) => {
    event.locals.auth = auth.handleRequest(event)
    const user = await event.locals.auth.validate()

    if (!event.route.id) {
        // console.log('No route id - Redirecting to Sign In')
        return Response.redirect(`${event.url.origin}/signin`, 302)
    }

    if (event.route.id?.startsWith('/(signedIn)') && !user) {
        // console.log('User Not Logged In - Redirecting to Sign In')
        return Response.redirect(`${event.url.origin}/signin`, 302)
    }

    if (event.route.id?.startsWith('/(signedOut)') && user) {
        // console.log('User Logged In - Redirecting to Welcome')
        return Response.redirect(`${event.url.origin}/welcome`, 302)
    }

    return await resolve(event)
}

const trpcInEvent: Handle = async ({ event, resolve }) => {
    const trpcCaller = router.createCaller(await createContext(event))
    event.locals.trpc = trpcCaller
    return await resolve(event)
}

export const handle = sequence(
    authHandler,
    createTRPCHandle({ router, createContext }),
    trpcInEvent
)