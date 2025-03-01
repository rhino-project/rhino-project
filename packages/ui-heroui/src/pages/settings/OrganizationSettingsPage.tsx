import { useCallback, useMemo } from 'react';

import { BaseAuthedPage } from '../BaseAuthedPage';
import { useBaseOwnerPath } from '@rhino-project/core/hooks';
import {
  hasOrganizationsModule,
  hasSubscriptionsModule
} from '@rhino-project/core/utils';
import { getSettingsPath } from '@rhino-project/core/utils';
import { Tab, Tabs } from '@heroui/react';
import { Outlet, useLocation } from '@tanstack/react-router';

export const OrganizationSettingsPage = () => {
  //Checking subscription payment related status
  // const { status, session_id } = useParsedSearch(); //FIXME use session_id for checking later
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
