# Event Feedback System with Certificate Generation

A full-stack application for managing events, collecting feedback, and generating certificates.

## Project Structure

```text
event-system/
├── backend/           # Backend (Node.js/Express)
│   ├── src/           # Source files
│   └── package.json   # Backend dependencies
├── frontend/          # Frontend (React)
│   ├── src/           # React source files
│   ├── public/        # Static files
│   └── package.json   # Frontend dependencies
└── README.md          # This file
```


## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud instance)

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd event-system
   ```

2. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example` and update with your configuration

3. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. **Start the application**
   ```bash
   # From the root directory
   
   # Development mode (runs both frontend and backend with hot-reload)
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm start` - Start the production server
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/event_feedback

# Session
SESSION_SECRET=your-session-secret
SESSION_NAME=event_system_sid

# CORS
CORS_ORIGIN=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100

# Email (for certificate delivery)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
EMAIL_FROM=noreply@yourevent.com

# File Uploads
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png
```

## Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. The production-ready files will be in the `frontend/build` directory

3. Deploy the `backend` folder to your server

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
