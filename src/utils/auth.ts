import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'

import { db } from '../db'
import { user, session, account, verification } from '../db/schema'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: { user, session, account, verification },
    }),
    emailAndPassword: { enabled: true },
    user: {
        additionalFields: {
            gender: {
                type: ['Male', 'Female'],
                required: true,
                input: true,
            },
        },
    },
})
