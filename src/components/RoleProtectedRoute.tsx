import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { UserRole } from '../types';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, status, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (status === 'loading') {
    return <div className="h-screen flex items-center justify-center text-muted-foreground animate-pulse">Loading secure environment...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle legacy roles mapped to UserRole type
  let currentRole: UserRole = user.role;
  if (currentRole === 'user' as any) currentRole = 'STUDENT';
  if (currentRole === 'admin' as any) currentRole = 'ADMIN';

  if (!allowedRoles.includes(currentRole)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          You do not have the required permissions to view this page.
        </p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
