import { useEffect } from 'react';
import { useUser } from './auth';
import { useHasOrganizationsModule } from './models';
import { useBaseOwner } from './owner';
import { useLocation } from '@tanstack/react-router';

export const usePageAnalytics = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.analytics) window.analytics.page(pathname);
  }, [pathname]);
};

export const useIdentifyAnalytics = () => {
  const user = useUser();

  useEffect(() => {
    if (user && window.analytics)
      window.analytics.identify(user.id, { email: user.email });
  }, [user]);
};

export const useGroupAnalytics = () => {
  const baseOwner = useBaseOwner();
  const enabled = useHasOrganizationsModule();

  useEffect(() => {
    if (enabled && baseOwner && window.analytics)
      window.analytics.group(baseOwner.id, { name: baseOwner.name });
  }, [enabled, baseOwner]);
};
