# Accela Ecommerce - Authentication Microservice part



## Features

- 🚀 **User Registration**
  - Email, password, name, and phone number
  - Password validation
  - Role-based access (user/admin)

- 🔐 **Secure Login**
  - JWT authentication
  - Token storage in localStorage/sessionStorage
  - Protected routes

- 📊 **User Dashboard**
  - Personalized welcome message
  - Secure logout
  - User profile display

- 🛡️ **Security**
  - Password hashing (backend)
  - Bearer token authentication
  - Protected API endpoints

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS

**Backend:**
- Node.js
- Express
- JWT Authentication
- Render.com hosting

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | User login |
| `/users` | GET | Get all users (protected) |
| `/users/{id}` | GET | Get specific user (protected) |
| `/users/{id}` | PATCH | Update user (protected) |
| `/users/{id}` | DELETE | Delete user (protected) |

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Next.js 14

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Accela-Tech-Academy/store-frontend.git
   cd accela-ecommerce/store-frontend
   ```
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

## Project Structure
store-frontend/
├── app/
│   ├── login/
│   │   └── page.js       # Login page
│   ├── register/
│   │   └── page.js       # Registration page
│   ├── dashboard/
│   │   └── page.js       # User dashboard
│   └── layout.js         # Root layout
├── public/               # Static assets
└── package.json
