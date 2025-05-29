import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';  // <-- Import Toaster here
import './index.css';
import App from './App';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Transactions from './pages/Transactions';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = React.useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return token ? children : <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>

    <BrowserRouter>
      {/* Add Toaster once here at top-level */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Protected app (Home page inside App.jsx) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </BrowserRouter>

  </AuthProvider>
);