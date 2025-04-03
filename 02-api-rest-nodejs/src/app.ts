import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

// Cadastro de cookies deve acontecer antes de qualquer rota
app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
