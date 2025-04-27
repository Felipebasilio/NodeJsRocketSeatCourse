import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  // Authenticate the user
  app.addHook('onRequest', verifyJWT)

  // Create a gym
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)

  // Search for gyms
  app.get('/gyms/search', search)

  // Fetch nearby gyms
  app.get('/gyms/nearby', nearby)
}
