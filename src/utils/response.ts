import type { Context } from "hono"
import type { ClientErrorStatusCode, ServerErrorStatusCode, SuccessStatusCode } from "hono/utils/http-status"

type ErrorStatusCode = ClientErrorStatusCode | ServerErrorStatusCode

export const responseSuccess = <T>(c: Context, data: T, status: SuccessStatusCode = 200) => {
    c.status(status)
    return c.json({ success: true, data })
}

export const responseError = (c: Context, message: string, status: ErrorStatusCode = 400) => {
    c.status(status)
    return c.json({ success: false, message })
}
