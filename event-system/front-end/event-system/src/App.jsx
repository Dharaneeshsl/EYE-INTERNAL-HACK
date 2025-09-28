// ...existing code...
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FeedbackForm from './pages/FeedbackForm';
import Certificates from './pages/Certificates';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import './App.css';


function AppShell() {
    const { user, logout } = useAuth();
    const { darkMode } = useTheme();

    return (
        <div className={darkMode ? 'bg-black text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
			<Router>
				<div className="flex min-h-screen">
                    {user && <Sidebar darkMode={darkMode} />}
					<div className="flex-1 flex flex-col">
                        {user && <Header darkMode={darkMode} user={user} logout={logout} />}
						<main className="flex-1 p-6">
							<Routes>
								<Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
								<Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
								<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
								<Route path="/forms" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
								<Route path="/feedback/:formId" element={<FeedbackForm />} />
								<Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
								<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
								<Route path="/" element={<Navigate to="/dashboard" />} />
							</Routes>
						</main>
					</div>
				</div>
			</Router>
		</div>
	);
}

function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<AppShell />
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;

