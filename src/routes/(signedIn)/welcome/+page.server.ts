import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({
    yolo: 'swek'
})

export const actions = {
    logout: async (event) => {
        event.locals.auth.setSession(null)
    }
}