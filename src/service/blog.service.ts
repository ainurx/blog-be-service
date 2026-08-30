import blogRepository from "../repository/blog.repository";

type BlogInput = {
    title: string;
    content: string;
};

// The ownership check: a blog can only be updated/deleted by the userId
// it was created with (blog.userId, a FK to user.id). `userId` here always
// comes from the authenticated session (c.get('user').id in the controller),
// never from the request body, so a caller can't just claim someone else's id.
const blogService = {
    create: async (userId: string, data: BlogInput) => {
        return blogRepository.create({ ...data, userId })
    },

    findAll: async () => {
        return blogRepository.findAll()
    },

    findById: async (id: number) => {
        return blogRepository.findById(id)
    },

    update: async (userId: string, id: number, data: Partial<BlogInput>) => {
        const existing = await blogRepository.findById(id)

        if (!existing) return { error: 'not_found' as const }
        if (existing.userId !== userId) return { error: 'forbidden' as const }

        const updated = await blogRepository.updateById(id, data)

        return { data: updated }
    },

    delete: async (userId: string, id: number) => {
        const existing = await blogRepository.findById(id)

        if (!existing) return { error: 'not_found' as const }
        if (existing.userId !== userId) return { error: 'forbidden' as const }

        const data = await blogRepository.deleteById(id)

        return { data }
    },
}

export default blogService
