# My Health Tracker

A simple, privacy-first personal health logging and insights app. Log daily vitals (water, exercise, glucose/sugar), visualize trends, and export personal data.

This repository contains a React frontend and an Express/MongoDB backend.

## Contents
- `frontend/` — React app (Tailwind v3, Chart.js)
- `backend/` — Express API, Mongoose models
- `pitch_deck.md` — investor pitch deck (draft)

## Tech stack
- Frontend: React, react-scripts, Tailwind CSS (v3), Chart.js
- Backend: Node.js, Express, MongoDB (Mongoose)
- Dev tooling: npm, nodemon (backend dev)

## Prerequisites
- Node.js (16+ recommended) and npm
- A MongoDB connection (Atlas URI or local MongoDB)

## Quick start (development)
Open two terminals (PowerShell recommended on Windows). Run the backend and frontend separately.

### Backend
1. Install dependencies and start the server:

```powershell
cd backend
npm install
# set MongoDB URI in the environment and start
$env:ATLAS_URI = 'your-mongodb-connection-string'
npm run server
# or for auto-restart during development:
npm run dev
```

- The backend listens on port defined by `PORT` env var or `5000` by default.
- Endpoints are mounted under `/api/entries` (see API section).

### Frontend
1. Install dependencies and start the dev server:

```powershell
cd frontend
npm install
# optionally change port if 3000 is occupied
$env:PORT = 3001; npm start
```

- The frontend uses `react-scripts start` and will prompt if port 3000 is busy; setting `PORT` avoids the prompt.

## API
Base URL: `http://localhost:5000/api/entries` (adjust port if you set `PORT` differently)

Available endpoints:

- GET /api/entries
  - Returns a JSON array of recent entries (sorted newest-first, limited to 100).
  - Response: 200 OK, body: [ { _id, water, exercise, sugar, createdAt }, ... ]

- POST /api/entries
  - Create a new entry.
  - Body (JSON): { "water": number, "exercise": number, "sugar": number }
  - Validation: all three fields required and must be non-negative numbers.
  - Successful response: 201 Created with the created entry JSON.

(See `backend/routes/entries.js`, `backend/controllers/entryController.js`, and `backend/models/Entry.js`.)

## Configuration
- Backend environment variables:
  - `ATLAS_URI` — required. MongoDB connection string.
  - `PORT` — optional, defaults to 5000.

- Frontend configuration
  - Tailwind is included as a dev dependency. If you run into Tailwind/PostCSS errors, see Troubleshooting below.

## Troubleshooting (known issues & fixes)

1. "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin" error
   - This can happen when PostCSS configuration expects the new Tailwind PostCSS plugin packaging. For this project using Tailwind v3, use a classic PostCSS config that includes `tailwindcss` and `autoprefixer`.
   - Example `frontend/postcss.config.js` (compatible with Tailwind v3):

```javascript
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
```

   - If you previously attempted to install `@tailwindcss/postcss` and got a `No matching version found` error, revert the dependency change and ensure `tailwindcss` is a v3.x release (this repo currently uses `tailwindcss@^3.4.6`). Then run `npm install` in `frontend` again.

2. Dev server port conflicts ("Something is already running on port 3000")
   - Either allow the prompt to run on another port, or set a port explicitly in PowerShell:

```powershell
$env:PORT = 3001
npm start
```

   - To kill lingering node/react-scripts processes on Windows:

```powershell
# stop all node processes (use with care)
Get-Process node | Stop-Process -Force
# or target by name
taskkill /F /IM node.exe
```

3. MongoDB connection errors
   - Ensure `ATLAS_URI` is set and valid. If using Atlas, ensure your IP whitelist allows your IP (or use 0.0.0.0/0 for testing), and your credentials are correct.

## Privacy & HIPAA notes
- The app is designed to be privacy-first (no analytics or data resale by default). If you plan to use this in clinical or production HIPAA-covered settings, you will need additional engineering and legal steps, including:
  - Business Associate Agreement (BAA) with your hosting provider
  - Encrypted storage and transport (TLS + encrypted at rest)
  - Audit logging, access control, and breach response plans
  - Formal security assessments

## Development notes & architecture
- Frontend UI components: `src/components/LogForm.js`, `ChartsPanel.js`, `RecentEntriesTable.js` handle input, charting, and display.
- Frontend service layer: `src/services/api.js` contains fetch/axios calls to the backend.
- Backend: `server.js` mounts `routes/entries.js`, which validates POST payloads and calls `controllers/entryController.js`.
- Data model: `backend/models/Entry.js` — a simple mongoose model for water, exercise, sugar and creation timestamp.

## Running in production / build
- To build the frontend for production:

```powershell
cd frontend
npm run build
```

- Then serve the `frontend/build` folder from a static file server or integrate with the backend (not currently wired to serve static build files by default).

## Tests
- There are no automated tests included yet. Suggested next steps: add unit tests for backend routes (Jest + supertest) and basic frontend component tests (React Testing Library).

## Pitch materials
- `pitch_deck.md` contains a draft investor pitch deck and speaker notes. You can export it to PDF or PPTX via your preferred markdown-to-presentation tooling (Pandoc, reveal-md, or PowerPoint templates).

## Contributing
- Contributions welcome. Suggested workflow:
  1. Fork the repo, create a feature branch
  2. Make changes and run the app locally
  3. Open a PR with a clear description and testing steps

## Contact
- Repository: (your GitHub link)
- Contact: (your email)


# deployment url
frontend- https://my-health-tracker-1.onrender.com/
backend- 

