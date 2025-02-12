import { useCallback, useMemo } from 'react';

import { BaseAuthedPage } from '../BaseAuthedPage';
import { ChangePassword } from '../../components/settings/ChangePassword';
import { EditProfile } from '../../components/settings/EditProfile';
import { Subscription } from '../../components/settings/Subscription';
import { useBaseOwnerPath, useParsedSearch } from '@rhino-project/core/hooks';
import {
  hasOrganizationsModule,
  hasSubscriptionsModule
} from '@rhino-project/core/utils';
import { Route, Routes, useLocation } from 'react-router-dom';
import { getAccountSettingsPath } from '@rhino-project/core/utils';
import { Tab, Tabs } from '@heroui/react';

export const SettingsPage = () => {
  //Checking subscription payment related status
  const { status, session_id } = useParsedSearch(); //FIXME use session_id for checking later
  const { build } = useBaseOwnerPath();
  const { pathname } = useLocation();

  const showSubscriptions = useMemo(
    () => hasSubscriptionsModule() && !hasOrganizationsModule(),
    []
  );

  const settingsBuild = useCallback(
    (tabId) => build(`${getAccountSettingsPath()}/${tabId}`),
    [build]
  );

  return (
    <BaseAuthedPage>
      <Tabs selectedKey={pathname}>
        <Tab
          key={settingsBuild('profile')}
          title="Profile"
          href={settingsBuild('profile')}
        />
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
        <Routes>
          <Route path="profile" element={<EditProfile />} />
          <Route path="password" element={<ChangePassword />} />
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
