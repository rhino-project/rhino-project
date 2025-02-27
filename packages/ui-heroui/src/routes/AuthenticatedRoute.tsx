import { Outlet, useRouter } from '@tanstack/react-router';
import { useAuth } from '@rhino-project/core/hooks';
import { useLayoutEffect } from 'react';

export const AuthenticatedRoute = () => {
  const { user } = useAuth();
  const router = useRouter();

  // // We rely on RhinoContext to ensure the session is validated before rendering
  // // https://github.com/TanStack/router/blob/d372e99dd8a6eaeb65df63836170fd70aa2f09af/examples/react/kitchen-sink-file-based/src/routes/login.tsx#L27
  useLayoutEffect(() => {
    if (!user) router.invalidate();
  }, [router, user]);

  return <Outlet />;
};
