import type { Context } from "hono"

import type { AuthVariables } from "../middleware/auth"
import blogService from "../service/blog.service"

type AuthedContext = Context<{ Variables: AuthVariables }>

const blogController = {
    // requireAuth (see router.ts) has already validated the session and set
    // `user` on the context — c.get('user').id is who is making this request.
    create: async (c: AuthedContext) => {
        const user = c.get('user')
        const body = await c.req.json()

        const created = await blogService.create(user.id, {
            title: body.title,
            content: body.content,
        })

        return c.json(created, 201)
    },

    findAll: async (c: Context) => {
        const blogs = await blogService.findAll()

        return c.json(blogs)
    },

    findByParams: (c: Context) => {

    },

    findById: async (c: Context) => {
        const id = Number(c.req.param('id'))
        const found = await blogService.findById(id)

        if (!found) {
            return c.json({ message: 'Not found' }, 404)
        }

        return c.json(found)
    },

    update: async (c: AuthedContext) => {
        const user = c.get('user')
        const id = Number(c.req.param('id'))
        const body = await c.req.json()

        const result = await blogService.update(user.id, id, {
            title: body.title,
            content: body.content,
        })

        if (result.error === 'not_found') {
            return c.json({ message: 'Not found' }, 404)
        }
        if (result.error === 'forbidden') {
            return c.json({ message: 'Forbidden' }, 403)
        }

        return c.json(result.data)
    },

    delete: async (c: AuthedContext) => {
        const user = c.get('user')
        const id = Number(c.req.param('id'))

        const result = await blogService.delete(user.id, id)

        if (result.error === 'not_found') {
            return c.json({ message: 'Not found' }, 404)
        }
        if (result.error === 'forbidden') {
            return c.json({ message: 'Forbidden' }, 403)
        }

        return c.json(result.data)
    },
}

export default blogController
