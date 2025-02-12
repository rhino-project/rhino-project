import { useCallback, useMemo } from 'react';

import { BaseAuthedPage } from '../BaseAuthedPage';
import { EditOrganizationProfile } from '../../components/settings/EditOrganizationProfile';
import { EditOrganizationAccess } from '../../components/settings/EditOrganizationAccess';
import { Subscription } from '../../components/settings/Subscription';
import { useBaseOwnerPath, useParsedSearch } from '@rhino-project/core/hooks';
import {
  hasOrganizationsModule,
  hasSubscriptionsModule
} from '@rhino-project/core/utils';
import { Route, Routes, useLocation } from 'react-router-dom';
import { getSettingsPath } from '@rhino-project/core/utils';
import { Tab, Tabs } from '@heroui/react';

export const OrganizationSettingsPage = () => {
  //Checking subscription payment related status
  const { status, session_id } = useParsedSearch(); //FIXME use session_id for checking later
  const { build } = useBaseOwnerPath();

  const showSubscriptions = useMemo(
    () => hasSubscriptionsModule() && hasOrganizationsModule(),
    []
  );

  const settingsBuild = useCallback(
    (tabId) => build(`${getSettingsPath()}/${tabId}`),
    [build]
  );

  const { pathname } = useLocation();

  return (
    <BaseAuthedPage>
      <Tabs selectedKey={pathname}>
        <Tab
          key={settingsBuild('profile')}
          title="Profile"
          href={settingsBuild('profile')}
        />
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
        <Routes>
          <Route path="profile" element={<EditOrganizationProfile />} />
          <Route path="access" element={<EditOrganizationAccess />} />
          {showSubscriptions && (
            <Route
              path="subscription"
              element={<Subscription status={status} session_id={session_id} />}
            />
          )}
        </Routes>
      </div>
    </BaseAuthedPage>
  );
};
