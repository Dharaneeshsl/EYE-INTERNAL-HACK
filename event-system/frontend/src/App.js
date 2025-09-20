import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import GlobalStyles from './theme/GlobalStyles';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import CertificateManagement from './components/certificates/CertificateManagement';
import ResponseAnalytics from './components/analytics/ResponseAnalytics';
import FormBuilder from './components/forms/FormBuilder';

function App() {
  // Mock authentication state - replace with real auth logic
  const isAuthenticated = true;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? (
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/forms/builder" 
            element={isAuthenticated ? (
              <DashboardLayout>
                <FormBuilder />
              </DashboardLayout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/certificates" 
            element={isAuthenticated ? (
              <DashboardLayout>
                <CertificateManagement />
              </DashboardLayout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/analytics" 
            element={isAuthenticated ? (
              <DashboardLayout>
                <ResponseAnalytics />
              </DashboardLayout>
            ) : <Navigate to="/login" />} 
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
