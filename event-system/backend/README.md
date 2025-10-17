Environment variables

Create a .env file with:

- PORT=5000
- MONGO_URI=mongodb://localhost:27017/event-system
- MONGO_DB_NAME=event-system
- SESSION_SECRET=change_me
- SESSION_NAME=sid
- CORS_ORIGIN=http://localhost:5173
- SMTP_HOST=localhost
- SMTP_PORT=1025
- EMAIL_FROM=no-reply@example.com
- EMAIL_FROM_NAME=Event System
- LOG_LEVEL=debug
- WS_PATH=/socket.io

Run

- npm install
- npm run dev
# EYE-INTERNAL-HACK Backend

## Setup Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values.
3. **Start MongoDB:**
   - Make sure MongoDB is running locally or update `MONGODB_URI` in `.env` for Atlas.
4. **Run the backend server:**
   ```sh
   npm start
   ```
   or (if using nodemon):
   ```sh
   npm run dev
   ```

## Folder Structure
- `src/` - Source code
- `uploads/` - File uploads
- `certificates/` - Generated certificates
- `logs/` - Log files

## Environment Variables
See `.env.example` for all required variables.

## Testing
```sh
npm test
```

## Docker
See project root for Dockerfile and docker-compose.yml (if present).
