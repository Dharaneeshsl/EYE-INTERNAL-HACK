import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvent } from '../../context/EventContext';

export default function ProtectedRoute({ children, requireEvent = false }) {
  const { user, loading } = useAuth();
  const { activeEventId } = useEvent();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (requireEvent && !activeEventId) return <Navigate to="/events" replace />;
  return children;
}
