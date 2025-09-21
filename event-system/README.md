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
   - Create a `.env` file in the backend directory
   - Configure the environment variables as shown in the Environment Variables section
   - Make sure to set a strong SESSION_SECRET for security

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

## Environment Setup

1. Create a `.env` file in the backend directory
2. Contact the project administrator for the required environment variables
3. Never commit the `.env` file to version control

Note: The `.env` file contains sensitive configuration. Keep it secure and private.
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password  # Use app-specific password when possible

Note: The application now uses secure session-based authentication instead of JWT tokens.
This provides better security and simpler implementation.
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
