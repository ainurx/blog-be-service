import type { Context } from "hono"

import type { AuthVariables } from "../middleware/auth"
import blogService from "../service/blog.service"
import { hasValue } from "../utils/check"
import { AppError } from "../utils/errors"
import { responseError, responseSuccess } from "../utils/response"

type AuthedContext = Context<{ Variables: AuthVariables }>

// Central error translation for the controller's try/catch below: a known
// AppError (thrown by repository/service) carries its own status/message,
// anything else is unexpected and gets logged + a generic 500.
const handleError = (c: Context, error: unknown) => {
    if (error instanceof AppError) {
        return responseError(c, error.message, error.status)
    }

    console.error(error)

    return responseError(c, 'Something went wrong', 500)
}

const blogController = {
    // requireAuth (see router.ts) has already validated the session and set
    // `user` on the context — c.get('user').id is who is making this request.
    create: async (c: AuthedContext) => {
        try {
            const user = c.get('user')
            const body = await c.req.json()

            if (!hasValue(body.title) || !hasValue(body.content)) {
                return responseError(c, 'title and content are required', 400)
            }

            const created = await blogService.create(user.id, {
                title: body.title,
                content: body.content,
            })

            return responseSuccess(c, created, 201)
        } catch (error) {
            return handleError(c, error)
        }
    },

    findAll: async (c: Context) => {
        try {
            const blogs = await blogService.findAll()

            return responseSuccess(c, blogs)
        } catch (error) {
            return handleError(c, error)
        }
    },

    findByParams: (c: Context) => {

    },

    findById: async (c: Context) => {
        try {
            const id = Number(c.req.param('id'))
            const found = await blogService.findById(id)

            return responseSuccess(c, found)
        } catch (error) {
            return handleError(c, error)
        }
    },

    update: async (c: AuthedContext) => {
        try {
            const user = c.get('user')
            const id = Number(c.req.param('id'))
            const body = await c.req.json()

            if (!hasValue(body.title) && !hasValue(body.content)) {
                return responseError(c, 'title or content is required', 400)
            }

            const updated = await blogService.update(user.id, id, {
                title: body.title,
                content: body.content,
            })

            return responseSuccess(c, updated)
        } catch (error) {
            return handleError(c, error)
        }
    },

    delete: async (c: AuthedContext) => {
        try {
            const user = c.get('user')
            const id = Number(c.req.param('id'))

            const deleted = await blogService.delete(user.id, id)

            return responseSuccess(c, deleted)
        } catch (error) {
            return handleError(c, error)
        }
    },
}

export default blogController
