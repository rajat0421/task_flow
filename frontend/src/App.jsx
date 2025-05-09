import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskBoard from './pages/TaskBoard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// App wrapper (for context providers)
function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
        <ToastContainer position="bottom-right" theme="colored" />
      </AuthProvider>
    </Router>
  );
}

// Main App component
function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      </Route>
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskBoard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppWrapper;
