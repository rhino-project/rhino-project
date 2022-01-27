import { useContext } from 'react';
import { AuthContext } from 'rhino/contexts/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useUser = () => {
  const { user } = useAuth();

  return user;
};

export const useAuthenticated = () => {
  const { user } = useAuth();

  return !!user;
};

export const useUserId = () => {
  const { user } = useAuth();

  return user?.id;
};
