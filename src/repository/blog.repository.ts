import { eq } from "drizzle-orm";
import { blog } from "../db/schema";
import { db } from "../db";
import { TBlog } from "../ts/Blog";

const blogRepository = {
    create: async (params: Omit<TBlog, 'id' | 'createdAt' | 'updatedAt'>) => {
        const result = await db.insert(blog).values(params).returning()

        return result[0]
    },

    findAll: async () => {
        const result = await db.select().from(blog)

        return result
    },

    findById: async (id: number) => {
        const result = await db.select().from(blog).where(eq(blog.id, id))

        return result[0]
    },

    updateById: async (id: number, params: Partial<Omit<TBlog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
        const result = await db.update(blog).set(params).where(eq(blog.id, id)).returning()

        return result[0]
    },

    deleteById: async (id: number) => {
        const result = await db.delete(blog).where(eq(blog.id, id)).returning()

        return result[0]
    }
}

export default blogRepository
