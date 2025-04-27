import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create'
import { validate } from './validate'
import { history } from './history'
import { metrics } from './metrics'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export function checkInsRoutes(app: FastifyInstance) {
  // Applies JWT verification middleware to all routes in this group
  // Validates that user is authenticated before accessing check-in endpoints
  app.addHook('onRequest', verifyJWT)

  // POST endpoint to create a new check-in for a specific gym
  // Requires gymId parameter and creates check-in for authenticated user
  app.post('/gyms/:gymId/check-ins', create)

  // PATCH endpoint to validate a specific check-in
  // Used by gym admins to confirm check-in was legitimate
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )

  // GET endpoint to retrieve check-in history for authenticated user
  // Returns paginated list of user's past check-ins
  app.get('/check-ins/history', history)

  // GET endpoint to fetch metrics about user's check-ins
  // Returns total number of check-ins for authenticated user
  app.get('/check-ins/metrics', metrics)
}
