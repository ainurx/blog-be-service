import blogRepository from "../repository/blog.repository";
import { ConflictError, ForbiddenError, NotFoundError } from "../utils/errors";

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
        const duplicate = await blogRepository.findByTitle(data.title)
        if (duplicate) throw new ConflictError('A blog with this title already exists')

        return blogRepository.create({ ...data, userId })
    },

    findAll: async () => {
        return blogRepository.findAll()
    },

    findById: async (id: number) => {
        const found = await blogRepository.findById(id)

        if (!found) throw new NotFoundError()

        return found
    },

    update: async (userId: string, id: number, data: Partial<BlogInput>) => {
        const existing = await blogRepository.findById(id)

        if (!existing) throw new NotFoundError()
        if (existing.userId !== userId) throw new ForbiddenError()

        if (data.title && data.title !== existing.title) {
            const duplicate = await blogRepository.findByTitle(data.title)
            if (duplicate) throw new ConflictError('A blog with this title already exists')
        }

        return blogRepository.updateById(id, data)
    },

    delete: async (userId: string, id: number) => {
        const existing = await blogRepository.findById(id)

        if (!existing) throw new NotFoundError()
        if (existing.userId !== userId) throw new ForbiddenError()

        return blogRepository.deleteById(id)
    },
}

export default blogService
