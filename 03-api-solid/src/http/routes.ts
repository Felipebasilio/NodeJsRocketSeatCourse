import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'

export async function appRoutes(app: FastifyInstance) {
  // User registration route
  app.post('/users', register)
  // Authentication route
  app.post('/sessions', authenticate)
}
