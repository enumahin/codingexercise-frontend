# Package Manager (Frontend)

Simple React frontend for the Coding Exercise backend. It uses **React Context** for state and demonstrates the **List all Packages** API.

## Prerequisites

- Node 18+
- Backend running at `http://localhost:8077` (see `codingexercise`)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. The app proxies `/api` to the backend, so requests go to `http://localhost:8077` with Basic auth (`user` / `pass`).

## Build

```bash
npm run build
npm run preview   # optional: preview production build
```

## Features

- **List packages** – Fetches and displays all packages from `GET /packages`.
- **Refresh** – Button to reload the list.
- **Context** – `PackagesContext` holds `packages`, `loading`, `error`, and `fetchPackages()`.

To change the API URL (e.g. for production), update the proxy in `vite.config.js` or use a `VITE_API_URL` env and set `API_BASE` in `src/context/PackagesContext.jsx`.
