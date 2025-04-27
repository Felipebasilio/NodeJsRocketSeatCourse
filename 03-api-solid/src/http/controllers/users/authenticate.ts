import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'
import { makeAuthenticateUseCase } from '@/use-cases/factory/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      // Here we cannot send password, since its not encrypted, it is encoded
      {
        sign: { sub: user.id },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: { sub: user.id, expiresIn: '7d' },
      },
    )

    // setCookie parameters:
    // 1. 'refreshToken' - the name of the cookie to be set
    // 2. refreshToken - the value to store in the cookie (the JWT refresh token)
    // 3. Options object:
    //    - path: '/' - cookie is available across entire site
    //    - secure: true - cookie only sent over HTTPS
    //    - sameSite: true - protects against CSRF, only sent in same-site requests
    //    - httpOnly: true - prevents client-side JavaScript from accessing the cookie
    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      // Bad request error, indicating that the request was not valid
      // due to invalid credentials
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
