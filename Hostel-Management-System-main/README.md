# Hostel Management

A simple hostel management web application with HTML frontend and Node.js + Express + MongoDB backend. This repo contains the frontend static pages and a backend API for authentication, room management, bookings, fees and maintenance.

## Features
- User signup / login (JWT-based authentication)
- Student dashboard and admin dashboard (static HTML/CSS/JS)
- Room management, bookings, fees and maintenance endpoints

## Repository structure
- `backend/` — Express API, models, controllers, routes and DB config
- `admin_dashboard.html`, `student_dashboard.html`, `login.html`, `signup.html`, `user_selection.html` — frontend pages
- `server.js` — (project root) optional server; primary API server available in `backend/server.js`

## Prerequisites
- Node.js (16+ recommended)
- MongoDB (local or Atlas)

## Environment variables
Create a `.env` file in `backend/` (or set env vars in your environment):

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `PORT` — backend server port (defaults often to `5000`)

## Setup & Run

1. Install dependencies for backend:

```bash
cd backend
npm install
```

2. Start backend API:

```bash
# either (if package.json defines start)
npm start

# or directly
node server.js
```

3. Frontend

The frontend is static HTML/CSS/JS files in the project root. You can open the HTML files directly in a browser or serve them with a static server for better behavior (CORS, fetch requests):

```bash
# from project root
npx http-server . -p 3000
# or use the Live Server extension in VS Code
```

## API Endpoints (overview)
The backend exposes REST endpoints grouped by feature. Check `backend/routes/` for full details. Common routes include:

- `POST /api/auth/register` — register new users
- `POST /api/auth/login` — login and receive JWT
- `GET/POST/PUT/DELETE /api/rooms` — room management
- `POST /api/bookings` — create booking
- `GET/POST /api/fees` — fees related endpoints
- `GET/POST /api/maintenance` — maintenance requests

Inspect the route files in `backend/routes/` for exact paths and payloads.

## Development notes
- DB config is in `backend/config/mongodb.js`.
- Controllers are in `backend/controllers/`.
- Models are in `backend/models/`.

## Contributing
- Fork the repo, create a feature branch, and open a pull request.

## License
This project is provided under the MIT License.

---
For questions or help running the project, open an issue or ask in the repo.
