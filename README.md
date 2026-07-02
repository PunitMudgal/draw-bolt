# DrawBolt

A collaborative, Excalidraw-style whiteboard. Sketch freehand or draw basic shapes on an infinite canvas, and see edits appear live for everyone in the same room. Built with the **Canvas API + [rough.js](https://roughjs.com/)** for a hand-drawn look, backed by a real-time WebSocket layer and Postgres persistence.

## Features

- Pencil (freehand), rectangle, ellipse, and line tools
- Hand-drawn rendering via rough.js on top of the native Canvas API
- Color and stroke-width selection
- Real-time multiplayer — shapes sync live to everyone in a room over WebSockets
- Drawing history persisted to Postgres and restored on load
- Email/password auth with JWT
- Create rooms and join by name

## Tech stack

- **Monorepo:** [Turborepo](https://turborepo.dev/) + [pnpm](https://pnpm.io/) workspaces
- **Frontend:** [Next.js](https://nextjs.org/) 16 (App Router), React 19, Tailwind CSS, Canvas API, rough.js
- **HTTP backend:** Express 5 (auth, rooms, chat history)
- **WebSocket backend:** `ws` (real-time shape broadcast + persistence)
- **Database:** PostgreSQL via [Prisma](https://www.prisma.io/)
- **Validation:** [Zod](https://zod.dev/) (shared schemas)
- **Language:** TypeScript everywhere

## Repository structure

```
excalidraw/
├── apps/
│   ├── excalidraw-fe/     # Next.js frontend (canvas UI, auth, rooms)
│   ├── http-backend/      # Express REST API (auth, rooms, chat history)
│   └── ws-backend/        # WebSocket server (real-time drawing sync)
└── packages/
    ├── common/            # Shared Zod schemas + types (Shape, Tool, auth)
    ├── database/          # Prisma schema, client, and migrations
    ├── backend-common/    # Shared backend config (JWT secret)
    ├── ui/                # Shared React components
    ├── eslint-config/     # Shared ESLint config
    └── typescript-config/ # Shared tsconfig bases
```

## How it works

Each drawn shape is serialized to JSON and sent over the existing WebSocket `chat` pipeline. The WebSocket backend broadcasts it to everyone in the room and persists it to the `Chat` table. When a board loads, it fetches the room's history over HTTP and replays the shapes onto the canvas.

```mermaid
flowchart LR
  Board["Canvas board (Next.js)"] -->|"draw shape (JSON)"| WsClient[WebSocket client]
  WsClient <-->|"join_room / chat"| Ws[ws-backend]
  Ws --> Db[("Postgres (Prisma)")]
  Ws -->|"broadcast shape"| WsClient
  Board -->|"GET history / auth / rooms"| Http[http-backend]
  Http --> Db
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** 9.15.9 (`corepack enable` will provision it automatically)
- A **PostgreSQL** database (local Docker or a hosted provider like [Neon](https://neon.tech/))

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/PunitMudgal/excalidraw.git
cd excalidraw
corepack enable
pnpm install
```

### 2. Configure environment variables

**`packages/database/.env`**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/excalidraw"
```

> Using a local database? You can start one quickly with Docker:
>
> ```bash
> docker run -d --name postgres-db \
>   -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=excalidraw \
>   -p 5432:5432 postgres
> ```

**Backends** (`apps/http-backend` and `apps/ws-backend`) — set as needed:

```env
JWT_SECRET="your-strong-secret"
PORT=8000                       # http-backend (optional, defaults to 8000)
FRONTEND_URL="http://localhost:3000"   # http-backend CORS origin
```

**`apps/excalidraw-fe/.env.local`**

```env
NEXT_PUBLIC_HTTP_BACKEND_URL="http://localhost:8000"
NEXT_PUBLIC_WS_URL="ws://localhost:8001"
```

### 3. Apply database migrations

```bash
cd packages/database
pnpm exec prisma migrate deploy   # apply existing migrations
pnpm exec prisma generate         # generate the Prisma client
cd ../..
```

### 4. Run everything

```bash
pnpm run dev
```

This starts all apps via Turborepo:

| App            | URL / Port              |
| -------------- | ----------------------- |
| Frontend       | http://localhost:3000   |
| HTTP backend   | http://localhost:8000   |
| WebSocket      | ws://localhost:8001     |

Open http://localhost:3000, sign up, create a room, and start drawing. Open the same room in a second tab to see live collaboration.

## Available scripts

Run from the repo root:

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `pnpm run dev`         | Run all apps in development                  |
| `pnpm run build`       | Build all apps and packages                  |
| `pnpm run lint`        | Lint the whole monorepo                      |
| `pnpm run check-types` | Type-check the whole monorepo                |
| `pnpm run format`      | Format with Prettier                         |

Target a single app with a filter, e.g.:

```bash
pnpm turbo dev --filter=excalidraw-fe
pnpm turbo build --filter=excalidraw-fe
```

## API overview

Base URL: `http://localhost:8000`

| Method | Endpoint                     | Auth   | Description                       |
| ------ | ---------------------------- | ------ | --------------------------------- |
| POST   | `/api/v1/auth/signup`        | —      | Create a new account              |
| POST   | `/api/v1/auth/signin`        | —      | Sign in, returns a JWT            |
| POST   | `/api/v1/room/createroom`    | Bearer | Create a room                     |
| GET    | `/api/v1/room/room/:slug`    | —      | Look up a room by slug            |
| GET    | `/api/v1/chat/chats/:roomId` | —      | Fetch a room's drawing history    |

**WebSocket** (`ws://localhost:8001?token=<JWT>`) message types: `join_room`, `leave_room`, `chat` (carries a serialized shape).

## Deployment

The **frontend** deploys to [Vercel](https://vercel.com/) (config in [`vercel.json`](vercel.json)). Set these environment variables in the Vercel project:

- `NEXT_PUBLIC_HTTP_BACKEND_URL` — deployed HTTP backend URL
- `NEXT_PUBLIC_WS_URL` — deployed WebSocket URL (use `wss://` in production)

The **HTTP and WebSocket backends** require a long-running Node host (e.g. Railway, Render, or Fly.io) and a hosted Postgres database (e.g. Neon).

## License

ISC
