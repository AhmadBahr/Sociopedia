## Sociopedia

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](#tech-stack)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](#tech-stack)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](#tech-stack)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.x-764ABC?logo=redux&logoColor=white)](#tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwindcss&logoColor=white)](#tech-stack)

A full-stack social media app built with the MERN stack, featuring auth, posts, profiles, friends, and real-time 1:1 chat.

### Features
- Auth: Register/Login with JWT, token persisted in localStorage
- Profiles: View profile, follow/unfollow, friends (add/remove/list), update profile (name, bio, avatar URL)
- Feed: Personalized feed (me + following), create posts with text and image upload
- Posts: User timeline, delete own post, like/unlike and comments (backend complete; UI for counts present)
- Search: Backend user search endpoint
- Real-time Chat:
  - Conversations list, open threads by user
  - Socket.IO real-time messages, REST message history
  - Pagination (cursor + limit), typing indicators, read receipts (events wired)
- UI/Navigation: Header (with chat icon), Footer, pages for Home, Login, Register, Profile, Chat

### Tech Stack
- Client: React 19, TypeScript, Vite 7, Redux Toolkit, React Router, Tailwind CSS 4
- Server: Node.js, Express, Mongoose (MongoDB), Zod, Socket.IO
- Tooling: ts-node-dev, ESLint, morgan, helmet, multer

### Project Structure
```
Sociopedia/
  server/             # Express + Socket.IO + Mongoose API
  client/             # Vite React app
  README.md
  LICENSE
```

#### Server
- `src/app.ts`: Express app, CORS, routes, static uploads
- `src/index.ts`: HTTP + Socket.IO bootstrap
- `src/models/*`: `User`, `Post`, `Conversation`, `Message`
- `src/controllers/*`: auth, users, posts, chat
- `src/routes/*`: REST endpoints

#### Client
- `src/app/store.ts`: Redux store
- `src/features/*`: `auth`, `posts`, `chat` slices
- `src/pages/*`: Home, Login, Register, Profile, Chat
- `src/components/*`: Header, Footer, PostComposer, PostCard
- `src/lib/*`: axios and socket helpers, config

## Getting Started
Prerequisites: Node.js 18+ and npm, MongoDB

1) Configure environment
```bash
# Server
cp server/.env.example server/.env
# Edit MONGO_URI, JWT_SECRET, CLIENT_URL

# Client
cp client/.env.example client/.env
# Ensure VITE_API_URL points to your server, e.g. http://localhost:5000/api
```

2) Install dependencies
```bash
cd server && npm i
cd ../client && npm i
```

3) Run in development
```bash
# Server (http://localhost:5000)
cd server && npm run dev

# Client (http://localhost:5173)
cd ../client && npm run dev
```

## API Overview
Base URL: `${SERVER_URL}/api`

- Auth: `POST /auth/register`, `POST /auth/login`
- Users: `GET /users/me`, `PUT /users/me`, `GET /users?q=...`, `GET /users/:id`,
  `POST /users/:id/follow`, `POST /users/:id/unfollow`,
  `POST /users/:id/friends`, `DELETE /users/:id/friends`,
  `GET /users/:id/followers`, `GET /users/:id/following`, `GET /users/:id/friends`
- Posts: `GET /posts/feed`, `POST /posts` (multipart), `POST /posts/:id/like`,
  `POST /posts/:id/comments`, `GET /posts/user/:userId`, `DELETE /posts/:id`
- Chat: `GET /chat/conversations`, `GET /chat/messages/:userId?cursor&limit`, `POST /chat/messages/:userId`

Socket events:
- Client → Server: `chat:send` { to, text }, `chat:typing` { to, typing }, `chat:read` { conversationId }
- Server → Client: `chat:message`, `chat:typing`, `chat:read`

## Scripts
Server: `npm run dev` · `npm run build` · `npm start` · `npm run typecheck`

Client: `npm run dev` · `npm run build` · `npm run preview`

## Environment Variables
Server `.env`: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV`

Client `.env`: `VITE_API_URL`

## License
Licensed under MIT – see [LICENSE](./LICENSE).

