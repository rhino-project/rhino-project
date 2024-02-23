import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from './auth';
import { useHasOrganizationsModule } from './models';
import { useBaseOwner } from './owner';

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
