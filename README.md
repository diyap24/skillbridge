<div align="center">

<br/>

```
.d88888b  dP       oo dP dP  888888ba           oo       dP                   
88.    "' 88          88 88  88    `8b                   88                   
`Y88888b. 88  .dP  dP 88 88 a88aaaa8P' 88d888b. dP .d888b88 .d8888b. .d8888b. 
      `8b 88888"   88 88 88  88   `8b. 88'  `88 88 88'  `88 88'  `88 88ooood8 
d8'   .8P 88  `8b. 88 88 88  88    .88 88       88 88.  .88 88.  .88 88.  ... 
 Y88888P  dP   `YP dP dP dP  88888888P dP       dP `88888P8 `8888P88 `88888P' 
                                                                 .88          
                                                             d8888P           
```

**Verified Skills & Micro-Credential Platform**

*Solve real coding challenges. Earn verifiable credentials. Get hired.*

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-skillbridge--olive--six.vercel.app-4fffb0?style=for-the-badge&logo=vercel&logoColor=black)](https://skillbridge-olive-six.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-9-512BD4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Render-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

<br/>

</div>

---

## Overview

SkillBridge is a full-stack platform that lets developers **prove their skills** through hands-on coding challenges and earn shareable, verifiable micro-credentials. Unlike resume claims, SkillBridge credentials are backed by actual code execution — each badge represents a challenge that was solved, graded, and recorded.

Employers browse a live job board. Candidates link their credential profile. The gap between *"I know Python"* and *"here's proof"* disappears.

<br/>

### 🎯 The Problem

The modern hiring pipeline is broken for developers:

- **Resumes lie** — anyone can write "proficient in React" with no evidence
- **Take-home assignments are slow** — days of back-and-forth before a candidate is validated
- **Leetcode scores don't transfer** — passing a DSA grind doesn't prove you can ship real features
- **Portfolios are unverifiable** — GitHub stars and side projects don't map to specific, testable skills

SkillBridge fixes this by replacing claims with proof. Every credential on a developer's profile is the direct result of working code that passed real test cases — not self-reported, not inferred.

<br/>

### 👥 Who It's For

| Audience | How they use SkillBridge |
|---|---|
| 🧑‍💻 **Job-seeking developers** | Complete challenges, earn credentials, attach their profile to job applications |
| 🏢 **Hiring companies** | Browse the job board, filter candidates by verified skill badges |
| 🎓 **Bootcamp / self-taught devs** | Build a credible, evidence-backed portfolio without a traditional degree |
| 🔁 **Career switchers** | Quickly demonstrate transferable skills in a new language or framework |

<br/>

### ⚙️ How It Works

```
1. Pick a challenge        Browse by language, difficulty, or skill tag
        │
        ▼
2. Write your solution     In-browser editor with starter code and test case previews
        │
        ▼
3. Submit & execute        Code runs server-side in a sandboxed Python/TS/C# subprocess
        │
        ▼
4. Get scored              Per-test-case grading: score = passing tests ÷ total × 100
        │
        ▼
5. Earn your credential    Score ≥ pass threshold → badge issued and locked to your profile
        │
        ▼
6. Share & apply           Public profile URL · PDF export · Web Share API · Job board apply
```

<br/>

### 🏆 Why SkillBridge vs the Alternatives

| | SkillBridge | LeetCode | HackerRank | GitHub Portfolio |
|---|:---:|:---:|:---:|:---:|
| Verifiable credentials | ✅ | ❌ | ⚠️ Partial | ❌ |
| Real code execution | ✅ | ✅ | ✅ | ❌ |
| Shareable public profile | ✅ | ❌ | ✅ | ✅ |
| Integrated job board | ✅ | ⚠️ Limited | ✅ | ❌ |
| Multi-language support | ✅ | ✅ | ✅ | ✅ |
| Self-hostable / open source | ✅ | ❌ | ❌ | ✅ |
| Skills radar dashboard | ✅ | ❌ | ❌ | ❌ |

---

## Features

| Feature | Description |
|---|---|
| ⚡ **Live Code Execution** | Submissions run server-side against real test cases — Python, TypeScript, C#, React |
| 🎖 **Micro-Credentials** | Pass a challenge above the score threshold and earn a verifiable badge tied to your profile |
| 📡 **Skills Radar** | Dashboard visualises skill coverage and score percentiles across all earned credentials |
| 📊 **Activity Graph** | Tracks credential issuance over time — showcasing consistent learning habits to recruiters |
| 💼 **Job Board** | Curated listings from Vercel, Stripe, Anthropic, Figma and more, with a direct apply flow |
| 🔗 **Shareable Profile** | Public profile with Web Share API integration and PDF export |
| 🔑 **API Tokens** | Generate and revoke personal access tokens from the settings panel |
| 🔐 **JWT Auth** | 15-minute access tokens with 7-day refresh token rotation |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel CDN                           │
│                 Next.js 16  (App Router)                    │
│    /challenges    /dashboard    /jobs    /profile           │
└────────────────────────────┬────────────────────────────────┘
                             │  HTTPS + JWT Bearer
┌────────────────────────────▼────────────────────────────────┐
│                  Render  (Docker / Debian)                   │
│                ASP.NET Core 9  REST API                     │
│                                                             │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐ │
│  │ PostgreSQL  │   │ MongoDB Atlas│   │  Upstash Redis   │ │
│  │─────────────│   │──────────────│   │──────────────────│ │
│  │ Users       │   │ Submissions  │   │  Response Cache  │ │
│  │ Challenges  │   │ (per-run     │   │                  │ │
│  │ Credentials │   │  results)    │   │                  │ │
│  └─────────────┘   └──────────────┘   └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

<table>
<tr>
<td valign="top" width="33%">

### Frontend
| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data Fetching | TanStack React Query |
| Charts | Recharts |
| HTTP Client | Axios + JWT interceptor |

</td>
<td valign="top" width="33%">

### Backend
| | |
|---|---|
| Framework | ASP.NET Core 9 |
| Language | C# |
| ORM | Entity Framework Core 9 |
| Auth | JWT Bearer + Refresh Tokens |
| Code Execution | Python subprocess (sandboxed) |
| API Docs | Swagger / OpenAPI |

</td>
<td valign="top" width="33%">

### Infrastructure
| | |
|---|---|
| Primary DB | PostgreSQL (Render) |
| Document Store | MongoDB Atlas |
| Cache | Redis (Upstash) |
| Backend Hosting | Render (Docker) |
| Frontend Hosting | Vercel |
| Container | Docker multi-stage (Debian .NET 9) |

</td>
</tr>
</table>

---

## Project Structure

```
skillbridge/
├── frontend/                      # Next.js 16 app
│   └── src/
│       ├── app/                   # App Router pages
│       │   ├── challenges/        # Challenge list + [id] submission page
│       │   ├── dashboard/         # Skills radar, activity graph, credentials
│       │   ├── jobs/              # Job board + apply flow
│       │   ├── profile/           # Public profile + share / PDF export
│       │   └── settings/          # Profile, security, API tokens
│       └── lib/
│           └── api.ts             # Axios instance with JWT interceptor
│
├── backend/
│   ├── SkillBridge.API/           # Controllers, Program.cs, middleware
│   ├── SkillBridge.Core/          # Interfaces, DTOs, domain models
│   └── SkillBridge.Infrastructure/
│       ├── Data/                  # EF Core DbContext + migrations + seeder
│       ├── Repositories/          # MongoDB submission repository
│       └── Services/              # Auth, challenge execution, credentials
│
├── Dockerfile                     # Multi-stage Debian build for Render
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org/)
- [.NET SDK 9](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Docker](https://www.docker.com/) *(optional)*
- PostgreSQL, MongoDB, and Redis running locally or via cloud providers

### 1 — Clone

```bash
git clone https://github.com/diyap24/skillbridge.git
cd skillbridge
```

### 2 — Configure the backend

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

Then run:

```bash
cd backend/SkillBridge.API
dotnet run
# API  →  http://localhost:5000
# Docs →  http://localhost:5000/swagger
```

> The database is auto-migrated and seeded with challenges and job postings on first run.

### 3 — Start the frontend

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm install
npm run dev
# App →  http://localhost:3000
```

---

## Deployment

### Backend → Render

1. Create a **Web Service** on [render.com](https://render.com) connected to this repo
2. Set **Runtime** → `Docker`, **Branch** → `main`
3. Add all backend environment variables listed below
4. Click **Create Web Service** — the Dockerfile handles the full multi-stage build

### Frontend → Vercel

```bash
npx vercel --cwd frontend
npx vercel env add NEXT_PUBLIC_API_URL production --cwd frontend
npx vercel --prod --cwd frontend
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

## API Reference

> Full interactive docs available at `/swagger` in development mode.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Login, receive JWT pair |
| `POST` | `/api/auth/refresh` | — | Rotate refresh token |
| `GET` | `/api/challenges` | — | List challenges (filterable by skill / difficulty) |
| `GET` | `/api/challenges/{id}` | — | Challenge detail + starter code |
| `POST` | `/api/challenges/{id}/submit` | 🔐 JWT | Submit code → receive score + credential |
| `GET` | `/api/credentials` | 🔐 JWT | List earned credentials |
| `GET` | `/api/skills` | — | List all skills |
| `GET` | `/api/jobs` | — | List job postings |

---

## Challenge Execution

Code submitted for Python challenges is executed server-side in a subprocess with:

- **Base64-encoded input** — prevents shell injection
- **Pipe-separated arguments** — supports multi-parameter functions e.g. `"1 3 5 7 9 | 5"`
- **Automatic type coercion** — inputs parsed to `int`, `float`, `list`, or `str`
- **Per-test-case grading** — score = passing tests ÷ total tests × 100
- **Credential issuance** — triggered automatically when score ≥ pass threshold

TypeScript, C#, and React challenges are evaluated against static test cases.

---

## Contact

<div align="center">

**Diya Patel**

[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/diya-patel-58639b210/) &nbsp; [![Gmail](https://img.shields.io/badge/-Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:diyadp25@gmail.com) &nbsp; [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/diyap24)

</div>

---

<div align="center">

© 2026 Diya Patel · All rights reserved

</div>
