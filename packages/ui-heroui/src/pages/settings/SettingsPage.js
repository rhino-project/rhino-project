import { useCallback, useMemo } from 'react';

import { BaseAuthedPage } from '../BaseAuthedPage';
import {
  hasOrganizationsModule,
  hasSubscriptionsModule
} from '@rhino-project/core/utils';
import { getAccountSettingsPath } from '@rhino-project/core/utils';
import { Tab, Tabs } from '@heroui/react';
import { Outlet, useLocation } from '@tanstack/react-router';
import { useBaseOwnerPath } from '../../hooks';

export const SettingsPage = () => {
  const { build } = useBaseOwnerPath();
  const { pathname } = useLocation();

  const showSubscriptions = useMemo(
    () => hasSubscriptionsModule() && !hasOrganizationsModule(),
    []
  );

  const settingsBuild = useCallback(
    (tabId) => build(`${getAccountSettingsPath()}${tabId ? `/${tabId}` : ''}`),
    [build]
  );

  return (
    <BaseAuthedPage>
      <h3>Account Settings</h3>
      <Tabs selectedKey={pathname}>
        <Tab key={settingsBuild()} title="Profile" href={settingsBuild()} />
        <Tab
          key={settingsBuild('password')}
          title="Password"
          href={settingsBuild('password')}
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
