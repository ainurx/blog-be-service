import { and, eq } from "drizzle-orm";
import { user } from "../db/schema";
import { db } from "../db";
import {TUser} from "../ts/User";

const userRepository = {
    // Sign-up goes through better-auth (POST /api/auth/sign-up/email), which
    // inserts the `users` row itself and generates the id. This is only for
    // direct/manual inserts (e.g. seeding), so it requires an id.
    create: async (
        params: Omit<TUser, 'updatedAt' | 'createdAt' | 'emailVerified' | 'image'> &
            Partial<Pick<TUser, 'emailVerified' | 'image'>>
    ) => {
        const result = await db.insert(user).values(params).returning()

        return result
    },

    findByParams: async (params: Partial<Pick<TUser, 'id' | 'email' | 'name'>>) => {
        const conditions = []
        if (params.id) conditions.push(eq(user.id, params.id))
        if (params.email) conditions.push(eq(user.email, params.email))
        if (params.name) conditions.push(eq(user.name, params.name))

        if (conditions.length === 0) return []

        const result = await db.select().from(user).where(and(...conditions))

        return result
    },

    findById: async (id: string) => {
        const result = await db.select().from(user).where(eq(user.id, id))

        return result[0]
    },

    findByEmail: async (email: string) => {
        const result = await db.select().from(user).where(eq(user.email, email))

        return result[0]
    },

    deleteById: async (id: string) => {
        const result = await db.delete(user).where(eq(user.id, id)).returning()

        return result[0]
    }
}

export default userRepository
