# HealZ

A full-stack healthcare management platform with separate admin, user, and backend services. This project is built using React (Vite) for the frontend, Node.js/Express for the backend, and MongoDB for data storage. Cloudinary is used for image uploads, and VideoSDK is integrated for video meetings.

## Project Structure

- `Frontend/` - Main user-facing React app
- `admin/` - Admin dashboard React app
- `doctor/` - (Not included in backend routes)
- `Server/` - Node.js/Express backend API

## Features

- User registration, authentication, and profile management
- Admin dashboard for managing doctors and appointments
- Appointment booking and health monitoring
- Lab records, insurance, and medical records management
- QR code-based user data sharing
- Cloudinary integration for image uploads
- VideoSDK integration for video meetings

## Environment Variables

### Server/.env
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
VITE_VIDEOSDK_AUTHTOKEN=your_videosdk_auth_token
```

### Frontend/.env
```
VITE_BACKEND_URI=your_backend_url
VITE_VIDEOSDK_AUTHTOKEN=your_videosdk_auth_token
```

## Build & Run

### Frontend/Admin/Doctor
```bash
npm install
npm run build
```

### Server
```bash
npm install
npm start
```

## API Endpoints (Server)

- `/api/admin/*` - Admin routes (login, add doctor, dashboard, appointments, etc.)
- `/api/user/*` - User routes (signup, signin, profile, appointments, QR data, etc.)
- `/api/meeting/*` - Video meeting routes

> **Note:** Doctor-related routes are not included in the backend API for deployment.

## Deployment
- Deploy frontend and admin apps as static sites (Vite build output)
- Deploy backend (Server) to Node.js hosting (e.g., Render, Heroku, Vercel)

## License
MIT
