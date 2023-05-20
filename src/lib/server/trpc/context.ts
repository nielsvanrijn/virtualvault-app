import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'
import { db } from '$lib/db/db'

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

// export async function createContext(event: RequestEvent, resolve: (event: RequestEvent) => Promise<unknown>) {
//     try {
//         // const token = event.cookies.get('jwt');
//         // 👆 or, if we're using HTTP headers based authentication, we could do something like this:
//         // const token = event.request.headers.get('authorization')?.replace('Bearer ', '');

//         // const { id: userId } = jwt.verify(token || '', JWT_SECRET) as { id: string };

//         // return { userId };
        
//         const session = event.cookies.get('session');
//         if (!session && !unProtectedRoutes.includes(event.url.pathname)) return redirect('/login', 'No authenticated user.');
        
//         return await resolve(event)
//     } catch {
//         // return { userId: '' };
//         return {auth: false};
//     }
// }

// export type Context = inferAsyncReturnType<typeof createContext>;

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
    const user = event.locals.auth.validate()
    return {
        user,
        db,
        auth: event.locals.auth,
        event
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;