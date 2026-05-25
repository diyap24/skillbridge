# SkillBridge

> **Verified Skills & Micro-Credential Platform**  
> Solve real coding challenges. Earn verifiable credentials. Get hired.

**Live Demo → [skillbridge-olive-six.vercel.app](https://skillbridge-olive-six.vercel.app)**

---

## Overview

SkillBridge is a full-stack platform that lets developers prove their skills through hands-on coding challenges and earn shareable, verifiable micro-credentials. Unlike resume claims, SkillBridge credentials are backed by actual code execution — each badge represents a challenge that was solved, graded, and recorded.

Employers browse a live job board. Candidates link their credential profile. The gap between "I know Python" and "here's proof" disappears.

---

## Features

- **Live Code Execution** — Submissions are executed server-side against real test cases (Python, TypeScript, C#, React)
- **Micro-Credentials** — Pass a challenge above the score threshold and earn a verifiable badge tied to your profile
- **Skills Radar** — Dashboard visualises your skill coverage and score percentiles across all earned credentials
- **Activity Graph** — Tracks credential issuance over time with a bar chart timeline
- **Job Board** — Curated listings from companies like Vercel, Stripe, Anthropic, Figma and more, with an apply flow
- **Shareable Profile** — Public profile page with Web Share API integration and PDF export
- **API Tokens** — Generate and revoke personal access tokens from the settings panel
- **JWT Auth** — Secure authentication with 15-minute access tokens and 7-day refresh token rotation

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data Fetching | TanStack React Query |
| Charts | Recharts |
| HTTP Client | Axios with JWT interceptor |

### Backend
| | |
|---|---|
| Framework | ASP.NET Core 9 |
| Language | C# |
| ORM | Entity Framework Core 9 |
| Auth | JWT Bearer + Refresh Tokens |
| Code Execution | Python subprocess (sandboxed) |
| API Docs | Swagger / OpenAPI |

### Infrastructure
| | |
|---|---|
| Primary DB | PostgreSQL (Render) |
| Document Store | MongoDB Atlas |
| Cache | Redis (Upstash) |
| Backend Hosting | Render (Docker) |
| Frontend Hosting | Vercel |
| Container | Docker multi-stage (Debian .NET 9) |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Vercel CDN                      │
│              Next.js 16  (App Router)               │
│   /challenges   /dashboard   /jobs   /profile       │
└────────────────────────┬────────────────────────────┘
                         │  HTTPS + JWT Bearer
┌────────────────────────▼────────────────────────────┐
│              Render  (Docker / Debian)               │
│            ASP.NET Core 9  REST API                 │
│                                                     │
│   ┌───────────┐  ┌─────────────┐  ┌─────────────┐  │
│   │ PostgreSQL│  │MongoDB Atlas│  │Upstash Redis│  │
│   │ Users     │  │ Submissions │  │  Response   │  │
│   │ Challenges│  │  (per-run   │  │   Cache     │  │
│   │ Credentials│ │   results)  │  │             │  │
│   └───────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure

```
skillbridge/
├── frontend/                   # Next.js 16 app
│   └── src/
│       ├── app/                # App Router pages
│       │   ├── challenges/     # Challenge list + [id] submission page
│       │   ├── dashboard/      # Skills radar, activity graph, credentials
│       │   ├── jobs/           # Job board + apply flow
│       │   ├── profile/        # Public profile + share/PDF
│       │   └── settings/       # Profile, security, API tokens
│       └── lib/
│           └── api.ts          # Axios instance with JWT interceptor
│
├── backend/
│   ├── SkillBridge.API/        # Controllers, Program.cs, middleware
│   ├── SkillBridge.Core/       # Interfaces, DTOs, domain models
│   └── SkillBridge.Infrastructure/
│       ├── Data/               # EF Core DbContext + migrations + seeder
│       ├── Repositories/       # MongoDB submission repository
│       └── Services/           # Auth, challenge execution, credentials
│
├── Dockerfile                  # Multi-stage Debian build for Render
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org/)
- [.NET SDK 9](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Docker](https://www.docker.com/) (optional)
- PostgreSQL, MongoDB, and Redis running locally (or use cloud providers)

### 1. Clone

```bash
git clone https://github.com/diyap24/skillbridge.git
cd skillbridge
```

### 2. Backend

Create `backend/SkillBridge.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "Postgres": "Host=localhost;Port=5432;Database=skillbridge;Username=<user>;Password=<pass>",
    "MongoDB": "mongodb://localhost:27017",
    "Redis": "localhost:6379"
  },
  "Jwt": {
    "Secret": "<minimum-32-char-random-string>",
    "Issuer": "skillbridge-api",
    "Audience": "skillbridge-app",
    "AccessTokenExpiryMinutes": "15",
    "RefreshTokenExpiryDays": "7"
  },
  "AllowedOrigins": [ "http://localhost:3000" ],
  "MongoDB": {
    "DatabaseName": "skillbridge"
  }
}
```

```bash
cd backend/SkillBridge.API
dotnet run
# API at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger
```

The database is auto-migrated and seeded with challenges and job postings on first run.

### 3. Frontend

```bash
cd frontend
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev
# App at http://localhost:3000
```

---

## Environment Variables

### Backend (ASP.NET Core)

| Variable | Description |
|---|---|
| `ConnectionStrings__Postgres` | Npgsql connection string |
| `ConnectionStrings__MongoDB` | MongoDB connection string |
| `ConnectionStrings__Redis` | StackExchange.Redis connection string |
| `Jwt__Secret` | Signing key (min 32 chars) |
| `Jwt__Issuer` | Token issuer identifier |
| `Jwt__Audience` | Token audience identifier |
| `AllowedOrigins__0` | CORS allowed origin (frontend URL) |

### Frontend (Next.js)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL e.g. `https://your-api.onrender.com/api` |

---

## Deployment

### Backend → Render

1. Create a **Web Service** on [render.com](https://render.com) connected to this repo
2. Set **Runtime** to **Docker**, **Branch** to `main`
3. Add all backend environment variables listed above
4. Click **Create Web Service** — the Dockerfile handles the full multi-stage build

### Frontend → Vercel

```bash
npx vercel --cwd frontend
npx vercel env add NEXT_PUBLIC_API_URL production --cwd frontend
npx vercel --prod --cwd frontend
```

---

## API Reference

Full interactive docs available at `/swagger` in development mode.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Login, receive JWT pair |
| `POST` | `/api/auth/refresh` | — | Refresh access token |
| `GET` | `/api/challenges` | — | List challenges (filterable by skill/difficulty) |
| `GET` | `/api/challenges/{id}` | — | Get challenge detail + starter code |
| `POST` | `/api/challenges/{id}/submit` | JWT | Submit code, receive score + credential |
| `GET` | `/api/credentials` | JWT | List earned credentials |
| `GET` | `/api/skills` | — | List all skills |
| `GET` | `/api/jobs` | — | List job postings |

---

## Challenge Execution

Code submitted for Python challenges is executed server-side in a subprocess with:

- **Base64-encoded input** to prevent shell injection
- **Pipe-separated arguments** for multi-parameter functions (`"1 3 5 7 9 | 5"`)
- **Automatic type coercion** — inputs are parsed to `int`, `float`, `list`, or `str`
- **Per-test-case grading** — score = passing tests ÷ total tests × 100
- **Credential issuance** — triggered automatically when score ≥ pass threshold

TypeScript, C#, and React challenges are evaluated against static test cases.

---

## Contact

**Diya Patel**  
[linkedin.com/in/diya-patel-58639b210](https://www.linkedin.com/in/diya-patel-58639b210/)  
[diyadp25@gmail.com](mailto:diyadp25@gmail.com)

---

© 2026 Diya Patel. All rights reserved.
