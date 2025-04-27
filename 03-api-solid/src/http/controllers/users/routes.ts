import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { refresh } from './refresh'
export async function usersRoutes(app: FastifyInstance) {
  // User registration route
  app.post('/users', register)
  // Authentication route
  app.post('/sessions', authenticate)
  // Profile route
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  // Refresh token route, to be called by front end when the JWT expires
  app.patch('/token/refresh', refresh)
}
