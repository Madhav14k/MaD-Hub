# Backend — Collaborative Project Tracker

Node.js + Express + PostgreSQL API for project management and collaboration.

## Setup
1. Install dependencies: `npm install`
2. Set up `.env` (see `.env.example`)
3. Run migrations: `npx prisma migrate dev` (if using Prisma)
4. Start server: `npm run dev`

## Features
- JWT authentication
- Role-based permissions
- CRUD for projects, tasks, comments, attachments
- Real-time updates (WebSocket)
- API docs (Swagger)
- Basic tests (Jest)
