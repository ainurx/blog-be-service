import { Hono } from 'hono'

import blogController from './controller/blog.controller'
import { requireAuth, type AuthVariables } from './middleware/auth'

const router = new Hono<{ Variables: AuthVariables }>()

router.post('/blogs', requireAuth, blogController.create)
router.get('/blogs', blogController.findAll)
router.get('/blogs/:id', blogController.findById)
router.patch('/blogs/:id', requireAuth, blogController.update)
router.delete('/blogs/:id', requireAuth, blogController.delete)

export default router
