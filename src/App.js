import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import AdminPanel from './pages/AdminPanel';
import ExcelUpload from './pages/ExcelUpload';
import FileHistory from './pages/FileHistory';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><ExcelUpload /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><FileHistory /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/filehistory" element={<FileHistory />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
