import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    {
      role: request.user.role,
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '10m',
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      role: request.user.role,
    },
    {
      sign: { sub: request.user.sub, expiresIn: '7d' },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
    })
    .status(200)
    .send({ token })
}
