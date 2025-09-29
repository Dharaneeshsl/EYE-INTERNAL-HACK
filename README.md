# EYE Internal Hackathon

Monorepo for the event system (backend + frontend).

## Structure
- `event-system/backend`: Node/Express + MongoDB (Mongoose)
- `event-system/front-end/event-system`: React (Vite)

## Prerequisites
- Node.js 18+
- MongoDB running locally or a URI in `backend/src/config/index.js`

## Setup
### Backend
```
cd event-system/backend
npm install
npm run dev
```
Backend serves at `http://localhost:5000`.

### Frontend
```
cd event-system/front-end/event-system
npm install
npm run dev
```
Vite serves at `http://localhost:5173`.

## Auth
- Protected pages use `ProtectedRoute`.
- Login/Register at `/login` and `/register`.

## Events and Scoping
- Active event is stored in `sessionStorage` as `activeEventId`.
- API requests auto-append `?eventId=<activeEventId>` when present.
- `Dashboard`, `Certificates`, and `Form Builder` refetch when the active event changes.
- Select an event in the `Events` page.

## Certificates
- Manage at `/certificates`.
- Create a template, map fields, generate/download.

## Forms
- Build at `/forms`.
- Publish and generate QR codes.

## Analytics
- Overview at `/dashboard`.

## Development Notes
- Frontend `src/services/api.js` appends `eventId` automatically.
- `ProtectedRoute` supports `requireEvent` prop; current routes allow access without forcing selection.

## Scripts (backend)
- `npm run dev`: start server with nodemon

## Scripts (frontend)
- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: preview build
