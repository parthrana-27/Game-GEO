# 🌐 StreetSight

A production-ready, GeoGuessr-style geography guessing game built with React, Node.js, PostgreSQL, Redis, and Leaflet.js.

---

## ✨ Features

- **Street View panorama** — Powered by Google Maps JavaScript API
- **Interactive Leaflet map** — Place your guess anywhere on the world map using OpenStreetMap tiles
- **Distance-based scoring** — Up to 5,000 points per round using the haversine formula
- **5-round game sessions** — With region modes: World, India, and Surat City
- **Leaderboard** — Global and per-region top 20 scores cached in Redis
- **Auth** — Email + password signup/signin with JWT (passwords bcrypt-hashed)
- **Dark mode UI** — Built with Tailwind CSS
- **Containerized** — Full Docker Compose setup

---

## 🏗️ Architecture

```
┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL │
│  React+Vite  │     │Express+Prisma│     │  (Prisma)   │
│  Tailwind    │     │   TypeScript │     └─────────────┘
│  Leaflet.js  │     │              │────▶   Redis
└──────────────┘     └──────────────┘       (Cache)
```

---

## 🚀 Quick Start (Docker Compose — Recommended)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- A [Google Maps API key](https://console.cloud.google.com/) with **Maps JavaScript API** enabled

### Steps

```bash
# 1. Clone the repo
git clone <repo-url>
cd GAME_GEOGUESS

# 2. Set environment variables
cp .env.example .env
# Edit .env and set:
#   JWT_SECRET=<random 64-char string>
#   STREET_VIEW_API_KEY=<your Google Maps API key>

# 3. Build and start all services
docker-compose up --build

# 4. Seed the database from the host (first time only)
cd backend
npm run seed
cd ..

# 5. Open the app
open http://localhost:5173
```

The backend API is available at `http://localhost:3001`.

---

## 💻 Local Development (without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+ (optional — the app works without it)

### Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in DATABASE_URL, REDIS_URL, JWT_SECRET, STREET_VIEW_API_KEY

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run seed

# Start in dev mode (hot reload)
npm run dev
# Runs at http://localhost:3001
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in VITE_STREET_VIEW_API_KEY

# Start dev server
npm run dev
# Runs at http://localhost:5173
```

---

## 🔑 Environment Variables

### Root `.env` (used by Docker Compose)

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | ✅ | Long random string for signing JWTs |
| `STREET_VIEW_API_KEY` | ✅ (for SV) | Google Maps API key |
| `OSM_TILE_URL` | ❌ | Custom OSM tile URL (default: standard OSM) |

### Backend `backend/.env`

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `JWT_SECRET` | — | JWT signing secret |
| `STREET_VIEW_API_KEY` | — | Google API key |
| `PORT` | `3001` | HTTP port |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |

### Frontend `frontend/.env`

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | Backend API base URL |
| `VITE_STREET_VIEW_API_KEY` | — | Google API key (client-side) |
| `VITE_OSM_TILE_URL` | Standard OSM | Overrides the map tile URL |

---

## 🗄️ Database

### Schema overview

| Table | Purpose |
|---|---|
| `users` | Email + bcrypt password hash |
| `games` | One per session; region, total score, completed flag |
| `rounds` | Per round: true & guess coords, distance, score |
| `locations` | Curated lat/lng pairs tagged by region |

### Seeding

Since the production backend container omits development dependencies (including `ts-node`), seeding is run directly from the host machine (which connects to the PostgreSQL database exposed at `localhost:5432`):

```bash
cd backend
npm run seed
```

The seed script populates ~60 locations across WORLD, INDIA, and CITY_SURAT.
To add your own, edit `backend/prisma/seed.ts`.

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Tests cover:
- `haversine.ts` — distance calculation (5 tests)
- `scoring.ts` — score function properties (7 tests)
- API routes — health, auth validation, leaderboard, 404 (4 tests)

---

## 📡 API Reference

### Auth
| Method | Endpoint | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/signup` | `{ email, password }` | `{ user }` |
| POST | `/api/auth/signin` | `{ email, password }` | `{ token, user }` |

### Game
| Method | Endpoint | Body/Query | Returns |
|---|---|---|---|
| POST | `/api/game/start` | `{ region }` | `{ gameId, roundNumber }` |
| GET | `/api/game/round` | `?gameId=` | `{ streetViewLat, streetViewLng, ... }` |
| POST | `/api/game/guess` | `{ gameId, lat, lng }` | `{ distanceKm, score, ... }` |
| POST | `/api/game/next` | `{ gameId }` | `{ roundNumber }` |
| GET | `/api/game/summary` | `?gameId=` | Full game summary |

### Leaderboard
| Method | Endpoint | Query | Returns |
|---|---|---|---|
| GET | `/api/leaderboard` | `?region=GLOBAL\|WORLD\|INDIA\|CITY_SURAT` | `{ entries[] }` |

---

## 📁 Project Structure

```
GAME_GEOGUESS/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # DB schema
│   │   └── seed.ts             # Location seed data
│   ├── src/
│   │   ├── server.ts           # Express entry point
│   │   ├── routes/             # Route definitions
│   │   ├── controllers/        # HTTP handlers
│   │   ├── services/           # Business logic
│   │   │   ├── gameService.ts
│   │   │   ├── authService.ts
│   │   │   ├── leaderboardService.ts
│   │   │   └── cacheService.ts  # Redis wrapper
│   │   ├── middleware/
│   │   └── utils/
│   │       ├── haversine.ts    # Distance formula
│   │       └── scoring.ts      # 0-5000 scoring
│   └── tests/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── GamePage.tsx
│       │   ├── SummaryPage.tsx
│       │   └── LeaderboardPage.tsx
│       ├── components/
│       │   ├── StreetViewPanel.tsx
│       │   ├── GuessMap.tsx       # Leaflet click-to-place
│       │   ├── ResultMap.tsx      # Leaflet result view
│       │   └── ResultOverlay.tsx
│       ├── hooks/
│       │   ├── useGame.ts
│       │   └── useAuth.ts
│       └── api/client.ts
├── docker-compose.yml
└── README.md
```

---

## 🔮 Extending the App

- **Add a new region**: Add entries to `prisma/seed.ts` with a new `region` tag, re-seed, and add a UI option in `HomePage.tsx`.
- **Custom tile server**: Set `VITE_OSM_TILE_URL` in the frontend `.env`.
- **Scale the backend**: The `cacheService.ts` abstraction is designed to be swapped for a distributed cache. The stateless Express app can be scaled horizontally behind a load balancer.
- **Add Kafka streaming**: Hook into `gameService.ts`'s `processGuess` function to emit events.

---

## 📜 License

MIT — free to use and extend.
