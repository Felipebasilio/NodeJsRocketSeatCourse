import { randomUUID } from "node:crypto";
import { Database } from "./database.ts";
import { buildRoutePath } from "./utils/build-route-path.ts";
import { IncomingMessage, ServerResponse } from 'node:http'

interface Request extends IncomingMessage {
  params?: { [key: string]: string }
  query?: { [key: string]: string }
  body?: any
}

interface Route {
  method: string
  path: RegExp
  handler: (req: Request, res: ServerResponse) => void
}

const database = new Database();

export const routes: Route[] = [
  {
    method: "GET",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const search = req.query?.search

      const users = database.select("users", search ? {
        name: search,
        email: search,
      } : undefined);

      return res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { name, email } = req.body;

      const user = {
        id: randomUUID(),
        name,
        email,
      };

      database.insert("users", user);

      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const id = req.params?.id;

      if (!id) {
        return res.writeHead(400).end();
      }

      database.delete("users", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const id = req.params?.id;
      const { name, email } = req.body;

      if (!id) {
        return res.writeHead(400).end();
      }

      database.update("users", id, { name, email });

      return res.writeHead(204).end();
    },
  },
]; 