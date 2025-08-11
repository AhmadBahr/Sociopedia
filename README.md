# Sociopedia 📱

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0+-61dafb.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47a248.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.0+-010101.svg)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0+-38b2ac.svg)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0+-764abc.svg)](https://redux-toolkit.js.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack social media platform built with the MERN stack, featuring real-time chat, user profiles, posts, and social interactions.

## ✨ Features

### 🔐 Authentication
- User registration and login with JWT
- Secure token storage and automatic API authentication
- Protected routes and middleware

### 👥 User Profiles
- View and edit user profiles
- Follow/unfollow other users
- Friends system (add/remove friends)
- Profile pictures and bio updates

### 📱 Social Feed
- Personalized feed showing posts from you and people you follow
- Create posts with text and image uploads
- Like/unlike posts and add comments
- Delete your own posts

### 💬 Real-time Chat
- 1:1 messaging with real-time updates via Socket.IO
- Conversation history with pagination
- Typing indicators and read receipts
- Message persistence and search

### 🔍 User Discovery
- Search for users by name
- View user profiles and posts
- Start conversations with any user

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time features
- **JWT** for authentication
- **Multer** for file uploads
- **Zod** for validation
- **Helmet** for security

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Redux Toolkit** for state management
- **React Router** for navigation
- **TailwindCSS** for styling
- **Socket.IO Client** for real-time features
- **Axios** for HTTP requests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sociopedia
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   cp .env.example .env
   # Edit .env with your API URL
   npm run dev
   ```

### Environment Variables

**Server (.env)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sociopedia
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
Sociopedia/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Database and environment config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, upload, error handling
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── realtime/      # Socket.IO setup
│   │   └── utils/         # Helper functions
│   └── public/uploads/    # Uploaded images
├── client/                # Frontend React app
│   ├── src/
│   │   ├── app/          # Redux store
│   │   ├── components/   # Reusable components
│   │   ├── features/     # Redux slices
│   │   ├── lib/          # API and socket helpers
│   │   ├── pages/        # Route components
│   │   └── types/        # TypeScript definitions
│   └── dist/             # Build output
└── README.md
```

## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # TypeScript type checking
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user
- `POST /api/users/:id/friends` - Add friend
- `DELETE /api/users/:id/friends` - Remove friend
- `GET /api/users/:id/friends` - Get friends list
- `GET /api/users?q=search` - Search users

### Posts
- `GET /api/posts/feed` - Get personalized feed
- `POST /api/posts` - Create post (with image upload)
- `GET /api/posts/user/:userId` - Get user's posts
- `POST /api/posts/:id/like` - Toggle like
- `POST /api/posts/:id/comments` - Add comment
- `DELETE /api/posts/:id` - Delete post

### Chat
- `GET /api/chat/conversations` - List conversations
- `GET /api/chat/messages/:userId` - Get messages with user
- `POST /api/chat/messages/:userId` - Send message

## 💬 Real-time Events

### Socket.IO Events
- `chat:send` - Send message
- `chat:message` - Receive message
- `chat:typing` - Typing indicator
- `chat:read` - Mark messages as read

## 🎨 UI Components

- **Header** - Navigation with messaging icon
- **Footer** - App information
- **PostComposer** - Create new posts
- **PostCard** - Display posts with interactions
- **Chat** - Two-pane messaging interface
- **Profile** - User profile with posts and friends

## 🔒 Security Features

- JWT authentication with secure token storage
- CORS configuration for cross-origin requests
- Helmet.js for security headers
- Input validation with Zod
- File upload restrictions
- Rate limiting (can be added)

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Run `npm run build`
3. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Update API URL in production environment
2. Run `npm run build`
3. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by popular social media platforms
- Real-time features powered by Socket.IO
- Styled with TailwindCSS

---

**Sociopedia** - Connect, Share, Chat! 🚀 