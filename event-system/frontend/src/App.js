import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './theme/theme';
import GlobalStyles from './theme/GlobalStyles';
import { lazyLoad } from './components/common/LazyWrapper';

// Lazy loaded components
const DashboardLayout = lazyLoad(() => import('./components/layout/DashboardLayout'));
const Dashboard = lazyLoad(() => import('./pages/Dashboard'));
const Login = lazyLoad(() => import('./pages/auth/Login'));
const CertificateManagement = lazyLoad(() => import('./components/certificates/CertificateManagement'));
const ResponseAnalytics = lazyLoad(() => import('./components/analytics/ResponseAnalytics'));
const FormBuilder = lazyLoad(() => import('./components/forms/FormBuilder'));

const App = () => {
  // Mock authentication state - replace with real auth logic
  const isAuthenticated = true;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          <Route path="/dashboard"
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
