import { eq } from "drizzle-orm";
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

    // findByParams: async (params: Partial<TUser>) => {
    //     const wherClause = eq()
    //     const result = await db.select().from(user).where()

    //     return result
    // },

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
