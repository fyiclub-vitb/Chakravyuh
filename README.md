# Chakravyuh

A timed, browser-based **spy / escape-room style puzzle game** built by the FYI Club (VIT Bhopal). Players register as an "agent", then work through **six Indian cities** in a fixed order, solving a puzzle in each one to uncover the location, date, time and scale of a planned attack. They have **90 minutes** in total. A wrong final answer, or running out of time, disqualifies the player. Everyone who finishes is ranked on a leaderboard by how much time they had left.

## Contents

- [How the game works](#how-the-game-works)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Data model](#data-model)
- [Production deployment](#production-deployment)
- [Known issues and notes](#known-issues-and-notes)

## How the game works

### Player flow

1. **Home (`/`)**: a "classified transmission" landing page. *Accept Mission* leads to registration.
2. **Register (`/register`)**: the player enters a registration number (format `23BAI10234`), a name and an email ending in `@vitbhopal.ac.in`. Registering starts the 90-minute clock (`timeStart` is set on the server). Registering again with the same ID resumes the existing session.
3. **Six cities, strictly in order.** Each city has a **backstory** page (`/<city>/backstory`) with a story image and a typed-out intel briefing, followed by the **game** page (`/<city>/game`) with the puzzle.

   | # | City | Puzzle |
   |---|------|--------|
   | 1 | Mumbai | Explore an embedded Unity WebGL scene and find a **3-digit access code** |
   | 2 | Bangalore | Explore a second Unity WebGL scene and find a passcode |
   | 3 | Pune | Analyse a device synchronisation report image and enter **Device ID, Frequency Band, Signal Strength, Delay Offset** |
   | 4 | Chennai | Identify an **NGO name** |
   | 5 | Jammu | Read a long scrolling intel log and make a **Yes/No assessment** (the wrong choice disqualifies) |
   | 6 | Delhi | Final submission: **city, date, time and number of locations** of the attack |

4. **Game pages** share a layout: puzzle on the left (about 80%) and a side panel on the right with the **mission timer**, the **current task** and the **answer input**.
5. **Correct answer**: the city is marked complete via the API and the player is sent to the next city's backstory.
6. **Disqualification** happens when the Delhi answer is wrong, when the Jammu assessment is wrong, or when the timer reaches zero. The player lands on `/disqualify`.
7. **Leaderboard (`/leaderboard`)** shows live stats (total, active, completed and disqualified players) and the top 10 finishers.

### Progress enforcement

`ProgressGuard` wraps every route and runs `useProgressCheck` on each navigation:

- If there is no `userData` in `localStorage`, the player is redirected to `/register`.
- Otherwise the app re-syncs with the server (it calls `/api/auth/register`, which doubles as login) and updates `localStorage`.
- A disqualified user is sent to `/disqualify`.
- Otherwise the player is forced onto the **first incomplete city**, so they cannot skip ahead or return to a completed city by typing a URL.
- `/`, `/register`, `/leaderboard` and `/disqualify` are exempt.

### Scoring

```
points = max(0, 5400 - secondsBetween(timeStart, submitAt))
```

Points are the **seconds remaining** when the player submitted the final answer. Only players with `isSubmitted = true` and `isDisqualified = false` appear on the leaderboard, sorted by points (highest first). Note that the leaderboard counts cities completed, but ranking is by time only.

### Timer

The timer is **client-side**: each game page computes `90 min - (now - timeStart)` from the stored `timeStart`. At `0` the page calls `POST /api/game/disqualify`.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Vite 7, Tailwind CSS 3, Axios |
| Puzzle scenes | Unity WebGL builds (Mumbai, Bangalore), embedded via `<iframe>` from `frontend/public` |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB |
| Prod frontend server | Small Express server (`frontend/server.js`) that serves `dist/` with Unity-friendly headers |

## Project structure

```
Chakravyuh/
├── backend/
│   ├── server.js            # Express app, CORS, mounts /api/auth and /api/game
│   ├── config/db.js         # Mongoose connection (exits the process on failure)
│   ├── models/User.js       # Player schema
│   └── routes/
│       ├── auth.js          # POST /register (register or log in)
│       └── game.js          # progress, disqualify, submit-answers, leaderboard
└── frontend/
    ├── server.js            # Production static server (gzip and COOP/COEP headers for Unity)
    ├── vite.config.js       # Dev server; proxies /api to localhost:5000
    ├── public/
    │   ├── Mumbai_game/     # Unity WebGL build
    │   └── Banglore_game/   # Unity WebGL build (note the spelling in the folder name)
    └── src/
        ├── App.jsx          # Routes, wrapped in ProgressGuard
        ├── components/ProgressGuard.jsx
        ├── hooks/useProgressCheck.js
        ├── utils/progressHelper.js    # city order, next-city and access helpers
        ├── assets/          # story images
        └── pages/           # Home, Register, Leaderboard, Disqualify and one folder per city
```

## Getting started

### Prerequisites

- Node.js 18 or newer (tested on Node 22)
- A MongoDB instance: local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone

```bash
git clone https://github.com/fyiclub-vitb/Chakravyuh.git
cd Chakravyuh
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/chakravyuh
PORT=5000
```

Start it:

```bash
npm start          # node server.js
# or, with auto-reload:
npx nodemon server.js
```

You should see `Server running on port 5000` and `MongoDB Connected`. Visiting <http://localhost:5000/> returns `Backend Running`.

### 3. Frontend

```bash
cd frontend
npm install        # use install, not ci (see Known issues)
```

Create `frontend/.env` (see [Environment variables](#environment-variables) for the full list):

```env
VITE_API_URL=http://localhost:5000/api

# Puzzle answers: you choose these, and the puzzle content must match them
VITE_MUMBAI_PASSCODE=...
VITE_BANGALORE_PASSCODE=...
VITE_PUNE_DEVICE_ID=...
VITE_PUNE_FREQUENCY_BAND=...
VITE_PUNE_SIGNAL_STRENGTH=...
VITE_PUNE_DELAY_OFFSET=...
VITE_CHENNAI_NGO_NAME=...
VITE_DELHI_CITY=...
VITE_DELHI_DATE=...
VITE_DELHI_TIME=...
VITE_DELHI_PLACES=...
```

Run the dev server:

```bash
npm run dev        # http://localhost:5173
```

Open <http://localhost:5173>, register with an ID like `24BCE11527` and an `@vitbhopal.ac.in` email, and play.

> **Unity scenes in dev mode:** the Unity builds are shipped as pre-compressed `.gz` files and need a server that sends `Content-Encoding: gzip`. The Vite dev server may not do this. If the Mumbai or Bangalore scene does not load in `npm run dev`, use the production build below, which does.

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | yes | MongoDB connection string |
| `PORT` | no | Defaults to `5000` |

### Frontend (`frontend/.env`)

All frontend variables are read at **build time** by Vite.

| Variable | Used in | Description |
|----------|---------|-------------|
| `VITE_API_URL` | all pages | Backend base URL **including `/api`**, e.g. `http://localhost:5000/api` |
| `VITE_MUMBAI_PASSCODE` | Mumbai | The 3-digit code |
| `VITE_BANGALORE_PASSCODE` | Bangalore | Bangalore passcode |
| `VITE_PUNE_DEVICE_ID` | Pune | Device ID (case-insensitive) |
| `VITE_PUNE_FREQUENCY_BAND` | Pune | Frequency band (exact match) |
| `VITE_PUNE_SIGNAL_STRENGTH` | Pune | Signal strength (case-insensitive) |
| `VITE_PUNE_DELAY_OFFSET` | Pune | Delay offset (exact match) |
| `VITE_CHENNAI_NGO_NAME` | Chennai | NGO name (case-insensitive, spaces ignored) |
| `VITE_DELHI_CITY` | Delhi | Attack city (case-insensitive) |
| `VITE_DELHI_DATE` | Delhi | Date; ordinal suffixes (`15th` vs `15`) and spaces are ignored |
| `VITE_DELHI_TIME` | Delhi | Time; minutes and spaces are ignored (`11:00 PM` matches `11 PM`) |
| `VITE_DELHI_PLACES` | Delhi | Number of locations (exact match) |

## API reference

Base URL: `http://localhost:5000/api`. All bodies are JSON and every response has a `success` flag.

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | `userId`, `name`, `email` | Creates a user and sets `timeStart`, or returns the existing user (idempotent login). Returns `400` on a duplicate email. |
| `POST` | `/game/update-progress` | `userId`, `city` | Marks one of `Mumbai, Bangalore, Pune, Chennai, Jammu, Delhi` as complete |
| `POST` | `/game/disqualify` | `userId` | Sets `isDisqualified` and `isSubmitted`, and records `submitAt` |
| `POST` | `/game/submit-answers` | `userId`, `city`, `date`, `time`, `places` | Stores the final answers, sets `isSubmitted` and `submitAt` |
| `GET` | `/game/leaderboard` | none | Returns `statistics`, the top 10 `leaderboard`, and the `activePlayers` with time remaining |

## Data model

`User` (MongoDB collection `users`):

| Field | Type | Notes |
|-------|------|-------|
| `userId` | String, unique | Registration number |
| `name`, `email` | String, `email` unique | |
| `cityProgress` | `{ Mumbai, Bangalore, Pune, Chennai, Jammu, Delhi }` | Booleans, default `false` |
| `timeStart` | Date | Set at first registration |
| `isDisqualified` | Boolean | |
| `isSubmitted`, `submitAt` | Boolean, Date | Set on final submission or disqualification |
| `city`, `date`, `time`, `places` | String | The submitted final answers |
| `createdAt`, `updatedAt` | Date | Added automatically by Mongoose timestamps |

## Production deployment

```bash
# Backend: host anywhere that runs Node (Render, Railway, a VM, ...)
cd backend && npm install && npm start

# Frontend
cd frontend
npm install
# set VITE_API_URL to the public backend URL, plus all puzzle variables
npm run build
npm start          # serves dist/ on PORT (default 3000)
```

`frontend/server.js`:

- serves `dist/` and falls back to `index.html` for React Router paths
- sets `Content-Encoding: gzip` and the correct MIME types for the Unity `.data.gz`, `.wasm.gz` and `.js.gz` files
- skips compression for already-compressed Unity files
- sets `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers

If you deploy the frontend to a static host (Vercel, Netlify, etc.) instead, you must reproduce those Unity headers there, or the Mumbai and Bangalore scenes will not load.

## Known issues and notes

- **Lockfile out of sync:** `frontend/package-lock.json` is missing `express` and `compression`, so `npm ci` fails. Use `npm install` and commit the updated lockfile.
- **Answers are visible in the browser:** because the answers are `VITE_*` variables, they are bundled into the public JavaScript, and a curious player can find them in DevTools. Answer checking should move to the backend (for example a `POST /api/game/verify` endpoint) before any serious or competitive event.
- **Client-trusted state:** the timer, the Jammu Yes/No decision and progress updates are driven by the browser, and the API does not verify that a player has actually solved a city before `update-progress` marks it complete. The backend does not validate the 90-minute limit either.
- **Missing `VITE_API_URL` fallback:** `Mumbai.jsx` calls `update-progress` with `VITE_API_URL` and no localhost fallback, unlike the other pages, so the variable must be set.
- **Registration-number rules:** the frontend enforces `^\d{2}[A-Z]{3}\d{5}$` and a `@vitbhopal.ac.in` email, but the backend does not.
- **Repo hygiene:** the `.vs/` folder (Visual Studio cache) is committed and should be removed and added to `.gitignore`. `frontend/README.md` is still the default Vite template text, and there is no `.env.example` yet.
- **Large assets:** the story images are about 9-10 MB each, which will slow first load on poor connections. Compressing them (WebP, or smaller dimensions) is an easy win.
- **Folder spelling:** the Bangalore Unity folder is `Banglore_game` (no "a"). The code is consistent with it, so don't "fix" one side only.
