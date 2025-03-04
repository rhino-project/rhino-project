import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import {
  useBaseOwner,
  useHasOrganizationsModule,
  useUser
} from '@rhino-project/core/hooks';

// Declare the analytics property on the Window interface
declare global {
  interface Window {
    analytics: {
      page: (pathname: string) => void;
      identify: (id: string, traits: { email: string }) => void;
      group: (id: string, traits: { name: string }) => void;
    };
  }
}

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
      window.analytics.group(String(baseOwner.id), {
        name: String(baseOwner.name)
      });
  }, [enabled, baseOwner]);
};
