import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'user' | 'admin';
}

export default function ProtectedRoute({ children, role = 'user' }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== role) {
      navigate(role === 'admin' ? '/admin-auth' : '/auth');
    }
  }, [user, role, navigate]);

  if (!user || user.role !== role) {
    return (
      <div className="min-h-screen bg-[#050d0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
