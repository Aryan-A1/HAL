import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const location = useLocation();

  // Wait for the store to rehydrate from localStorage.
  // Without this, isAuthenticated is always false on first render,
  // causing logged-in users to be redirected to login.
  if (!hasHydrated) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    sessionStorage.setItem('intendedUrl', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
