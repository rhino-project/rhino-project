import { useRhinoContext } from '../RhinoContext';

export const useAuth = () => {
  return useRhinoContext();
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
