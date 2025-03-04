import { useCallback, useMemo } from 'react';

import { BaseAuthedPage } from '../BaseAuthedPage';
import {
  hasOrganizationsModule,
  hasSubscriptionsModule
} from '@rhino-project/core/utils';
import { getSettingsPath } from '@rhino-project/core/utils';
import { Tab, Tabs } from '@heroui/react';
import { Outlet, useLocation } from '@tanstack/react-router';
import { useBaseOwnerPath } from '../../hooks';

export const OrganizationSettingsPage = () => {
  const { build } = useBaseOwnerPath();

  const showSubscriptions = useMemo(
    () => hasSubscriptionsModule() && hasOrganizationsModule(),
    []
  );

  const settingsBuild = useCallback(
    (tabId: string) => build(`${getSettingsPath()}${tabId ? `/${tabId}` : ''}`),
    [build]
  );

  const { pathname } = useLocation();

  return (
    <BaseAuthedPage>
      <Tabs selectedKey={pathname}>
        <Tab key={settingsBuild('')} title="Profile" href={settingsBuild('')} />
        <Tab
          key={settingsBuild('access')}
          title="Access"
          href={settingsBuild('access')}
        />
        {showSubscriptions && (
          <Tab
            key={settingsBuild('subscription')}
            title="Subscription"
            href={settingsBuild('subscription')}
          />
        )}
      </Tabs>
      <div className="mt-4">
        <Outlet />
      </div>
    </BaseAuthedPage>
  );
};
