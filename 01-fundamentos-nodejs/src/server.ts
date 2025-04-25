import http from 'node:http'
import { json } from './middlewares/json.ts'
import { routes } from './routes.ts'
import { extractQueryParams } from './utils/extract-query-params.ts'

interface Request extends http.IncomingMessage {
  params?: { [key: string]: string }
  query?: { [key: string]: string }
}

interface Route {
  method: string
  path: RegExp
  handler: (req: Request, res: http.ServerResponse) => void
}

const server = http.createServer(async (req: Request, res: http.ServerResponse) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route: Route) => {
    return route.method === method && route.path.test(url!)
  })

  if (route) {
    const routeParams = url!.match(route.path)

    const { query, ...params } = routeParams!.groups!

    req.params = params
    req.query = query ? extractQueryParams(query) : {}
    
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333) 