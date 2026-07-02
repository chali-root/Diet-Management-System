import { Navigate, useLocation } from 'react-router-dom';
import { getStoredToken } from '@/api/request';

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const location = useLocation();
  const token = getStoredToken();
  const savedUser = localStorage.getItem('diet_user');

  // 登录页不需要守卫
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  if (!token || !savedUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
