# Event System - Form Builder & Analytics Platform

A comprehensive event management system with dynamic form building, real-time analytics, and certificate generation capabilities.

## 🚀 Features

### Core Functionality
- **Dynamic Form Builder**: Create surveys and forms using SurveyJS with drag-and-drop interface
- **Real-time Analytics**: Live dashboard with response tracking and sentiment analysis
- **Certificate Generation**: Automated PDF certificate creation and email distribution
- **QR Code Integration**: Generate QR codes for easy form sharing
- **User Management**: Role-based authentication (Admin/User)
- **Responsive Design**: Dark theme with modern UI/UX

### Form Builder
- Visual form designer with SurveyJS
- Multiple question types (text, radio, checkbox, dropdown, etc.)
- Form preview and testing
- JSON export/import
- Form sharing via links and QR codes

### Analytics Dashboard
- Real-time response tracking
- Sentiment analysis of responses
- Visual charts and graphs
- Export capabilities
- Response filtering and search

### Certificate System
- Custom certificate templates
- Automated generation based on form responses
- Email distribution
- PDF download options

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **SurveyJS** - Form builder and rendering
- **Tailwind CSS** - Styling framework
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **Nodemailer** - Email service
- **PDF-lib** - PDF generation
- **Multer** - File upload handling

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd front-end/event-system
npm install
```

## 🚀 Getting Started

### 1. Start MongoDB
Make sure MongoDB is running on your system.

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-system
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Start Backend Server
```bash
cd backend
npm start
```

### 4. Start Frontend Development Server
```bash
cd front-end/event-system
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
event-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and session configuration
│   │   ├── controllers/     # API route handlers
│   │   ├── middleware/      # Authentication and upload middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── server.js
├── front-end/
│   └── event-system/
│       ├── src/
│       │   ├── components/  # Reusable React components
│       │   ├── pages/       # Main application pages
│       │   ├── services/    # API service functions
│       │   └── context/     # React context providers
│       ├── package.json
│       └── vite.config.js
└── docker-compose.yml
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Forms
- `GET /api/forms` - Get all forms
- `POST /api/forms` - Create new form
- `GET /api/forms/:id` - Get form by ID
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `GET /api/forms/:id/qr` - Generate QR code

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/responses` - Response analytics

### Certificates
- `GET /api/certificates` - Get certificates
- `POST /api/certificates` - Create certificate
- `DELETE /api/certificates/:id` - Delete certificate
- `GET /api/certificates/:id/download` - Download certificate

## 🎨 UI Components

### Form Builder
- **SurveyBuilder**: Main form creation interface
- **SurveyForm**: Form rendering for participants
- **FieldMapping**: Certificate field mapping

### Common Components
- **Button**: Reusable button component
- **Card**: Content container
- **Modal**: Popup dialogs
- **Toast**: Notification messages
- **Table**: Data display
- **Loader**: Loading indicators

### Layout Components
- **Header**: Navigation header
- **Sidebar**: Navigation sidebar
- **ProtectedRoute**: Authentication guard

## 🔒 Authentication

The system uses session-based authentication with the following features:
- User registration and login
- Role-based access control (Admin/User)
- Protected routes
- Session management

## 📊 Analytics Features

- Real-time response tracking
- Sentiment analysis using AI
- Visual charts and graphs
- Export capabilities
- Response filtering and search

## 🎓 Certificate System

- Custom certificate templates
- Automated generation based on form responses
- Email distribution
- PDF download options
- Field mapping for dynamic content

## 🚀 Deployment

### Using Docker
```bash
docker-compose up -d
```

### Manual Deployment
1. Build the frontend: `npm run build`
2. Start the backend server
3. Configure environment variables
4. Set up MongoDB connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Check console for errors
- Ensure all dependencies are installed

## 🔄 Updates

- Form builder with SurveyJS integration
- Real-time analytics dashboard
- Certificate generation system
- QR code integration
- Dark theme implementation
- Responsive design