import { IncomingMessage, ServerResponse } from 'node:http'

interface Request extends IncomingMessage {
  body?: any
}

export async function json(req: Request, res: ServerResponse) {
  const buffers: Buffer[] = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  res.setHeader('Content-type', 'application/json')
} 