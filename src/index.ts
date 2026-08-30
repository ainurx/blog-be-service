import { Hono } from 'hono'

import 'dotenv/config';
import { auth } from './utils/auth';
import router from './router';

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// better-auth owns everything under /api/auth/*, e.g.:
//   POST /api/auth/sign-up/email  { email, password, name, gender }
//   POST /api/auth/sign-in/email  { email, password }
app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.route('/api', router)

export default app
