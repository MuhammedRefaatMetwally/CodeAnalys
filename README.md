# DevLens — AI-Powered PR Code Review

> Paste a GitHub PR URL. Get instant AI-powered feedback on code quality, security, and best practices.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)

---

## What is DevLens?

DevLens is a full-stack developer tool that automates code review using AI.

1. Paste a GitHub PR URL
2. DevLens fetches every changed file via the **GitHub API**
3. Sends the code to **Gemini 1.5 Flash** for analysis
4. Returns a structured report — **0–100 quality score**, file-by-file breakdown, and issues sorted by severity

Analysis runs **asynchronously** via a **BullMQ job queue** — the API never blocks, never times out.

---

## Monorepo Structure

```
devlens/
├── apps/
│   ├── api/        # NestJS backend
│   └── web/        # Next.js frontend
├── docker-compose.yml
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS · Prisma ORM · PostgreSQL · BullMQ · Redis |
| Frontend | Next.js · React Query · Zustand · Shadcn/UI · Tailwind |
| AI & APIs | Gemini 1.5 Flash · GitHub API (Octokit) |
| Auth | JWT · Passport |
| DevOps | Docker · Neon DB |

---

## How It Works

```
POST /analysis
  → Create DB record (PENDING)
  → Push job to BullMQ queue
  → Return { id, PENDING } immediately

Background worker:
  → Fetch PR files from GitHub API
  → Send code to Gemini AI
  → Update DB record (COMPLETED + result)

Frontend:
  → Polls GET /analysis/:id every 3s
  → Displays result when COMPLETED
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop
- [Neon DB](https://neon.tech) account (free PostgreSQL)
- [GitHub Personal Access Token](https://github.com/settings/tokens)
- [Gemini API Key](https://aistudio.google.com) (free)

### 1. Clone

```bash
git clone https://github.com/MuhammedRefaatMetwally/devlens.git
cd devlens
```

### 2. Start Redis locally

```bash
docker-compose up -d
```

### 3. Setup backend

```bash
cd apps/api
cp .env.example .env   # fill in your credentials
npm install
npx prisma migrate dev
npm run start:dev
```

### 4. Setup frontend

```bash
cd apps/web
cp .env.example .env.local   # fill in your credentials
npm install
npm run dev
```

### 5. Open

```
http://localhost:3000
```

---

## Environment Variables

**`apps/api/.env`**
```env
DATABASE_URL=
REDIS_URL=redis://localhost:6379
JWT_SECRET=
PORT=3001
GITHUB_TOKEN=
GEMINI_API_KEY=
FRONTEND_URL=http://localhost:3000
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Author

**Muhammed Refaat Metwally**
[LinkedIn](https://www.linkedin.com/in/muhammedrefaat/) · [GitHub](https://github.com/MuhammedRefaatMetwally/)
