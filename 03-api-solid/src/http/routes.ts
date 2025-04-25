import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'
export async function appRoutes(app: FastifyInstance) {
  // User registration route
  app.post('/users', register)
  // Authentication route
  app.post('/sessions', authenticate)
  // Profile route
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
