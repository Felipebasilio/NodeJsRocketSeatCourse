# src/server.ts

## Interfaces

### Route

- **Line:** 11
- **Properties:**
method: string
  path: RegExp
  handler: (req: Request, res: http.ServerResponse) => void
