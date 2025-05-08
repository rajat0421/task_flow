# TaskFlow Application

A full-stack task management application built with React and Node.js.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local or Atlas connection)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root of the backend directory with the following content:
   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
   
   Note: Replace `mongodb://localhost:27017/taskflow` with your MongoDB connection string if using Atlas.

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root of the frontend directory with the following content:
   ```
   VITE_API_URL=http://localhost:4000/api
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. Open your browser and go to the URL displayed in the terminal (usually http://localhost:5173)

## Application Features
- User authentication (register/login)
- Create, read, update, and delete tasks
- Task priority and status management

## Technology Stack
- Frontend: React, Redux Toolkit, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT 