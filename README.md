# Voting App

A full-stack voting application where users can create polls, vote on them, and view results. The app is built with a React frontend and an Express.js backend, using MongoDB as the database.

## Features

- User authentication (signup/login)
- Create polls with multiple options
- Vote on polls anonymously or as a logged-in user
- View poll results with vote percentages
- Real-time updates using Socket.IO

---

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/satishrathod-dev/voting-app.git
cd voting-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Create a `.env` file in the `backend` directory and add the following:

```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

Start the backend server:

```bash
nodemon server.js
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Create a `.env` file in the `frontend` directory and add the following:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## Usage

- Open the frontend in your browser at `http://localhost:5173`.
- Sign up or log in to create polls.
- Vote on polls and view results.

---

## Technologies Used

### Frontend:

- React
- Vite
- TailwindCSS
- React Router
- Axios

### Backend:

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- bcrypt for password hashing
