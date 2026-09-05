import type { ClientErrorStatusCode, ServerErrorStatusCode } from "hono/utils/http-status"

type ErrorStatusCode = ClientErrorStatusCode | ServerErrorStatusCode

// Base for business/validation errors that should surface as a specific HTTP
// status, rather than the generic 500 an unexpected error falls back to.
// Thrown from repository/service, caught in the controller's try/catch.
export class AppError extends Error {
    status: ErrorStatusCode

    constructor(message: string, status: ErrorStatusCode) {
        super(message)
        this.name = this.constructor.name
        this.status = status
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not found') {
        super(message, 404)
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409)
    }
}
