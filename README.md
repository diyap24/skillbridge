# SkillBridge

> Verified Skills & Micro-Credential Platform

Employers post coding challenges. Candidates solve them in a live browser editor.
Passing earns a permanent, publicly verifiable credential badge.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, React Query, Zustand, Monaco Editor |
| Backend | ASP.NET Core 9 Web API, Entity Framework Core |
| Auth | JWT access + refresh tokens, RBAC |
| Primary DB | PostgreSQL 16 |
| Document DB | MongoDB 7 |
| Cache | Redis 7 |
| CI/CD | GitHub Actions + Docker |

## Getting Started

### Prerequisites
- Node.js 20+, .NET 9 SDK, Docker Desktop

### 1. Clone
```bash
git clone https://github.com/diyap24/skillbridge.git
cd skillbridge
```

### 2. Start databases
```bash
cd infra && docker-compose up -d
```

### 3. Run backend
```bash
cd backend
dotnet run --project SkillBridge.API
# API: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

### 4. Run frontend (after Phase 5)
```bash
cd frontend
npm install && npm run dev
# App: http://localhost:3000
```

## Demo Login
| Email | Password | Role |
|---|---|---|
| admin@skillbridge.dev | Admin@123 | Admin |

## Project Status
- [x] Phase 1 — Project setup & Docker
- [x] Phase 2 — .NET solution & domain models
- [x] Phase 3 — Database layer (PostgreSQL + MongoDB + Redis)
- [x] Phase 4 — All API controllers
- [ ] Phase 5 — Next.js frontend (in progress)
- [ ] Phase 6 — Tests & Docker
- [ ] Phase 7 — GitHub Actions CI/CD
