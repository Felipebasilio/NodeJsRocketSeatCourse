import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  // Geralmente quem define a porta do ambiente de produção é o serviço de hospedagem
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
})

// safeParse vai tentar validar o process.env pra ver se ele tem exatamente as informações que tipamos no zod acima
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
