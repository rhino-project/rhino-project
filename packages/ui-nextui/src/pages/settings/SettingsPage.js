import { useMemo } from 'react';

import { BaseAuthedPage } from '../BaseAuthedPage';
import { ChangePassword } from '../../components/settings/ChangePassword';
import { EditProfile } from '../../components/settings/EditProfile';
import { Subscription } from '../../components/settings/Subscription';
import { useBaseOwnerPath, useParsedSearch } from '@rhino-project/core/hooks';
import {
  hasOrganizationsModule,
  hasSubscriptionsModule
} from '@rhino-project/core/utils';
import { Route, Routes } from 'react-router-dom';
import { getAccountSettingsPath } from '@rhino-project/core/utils';
import { Tab, Tabs } from '@heroui/react';
import { useLocation } from 'react-use';

const tabTo = (baseOwnerPath, tabId) =>
  baseOwnerPath.build(`${getAccountSettingsPath()}/${tabId}`);

export const SettingsPage = () => {
  //Checking subscription payment related status
  const { status, session_id } = useParsedSearch(); //FIXME use session_id for checking later
  const baseOwnerPath = useBaseOwnerPath();

  const showSubscriptions = useMemo(
    () => hasSubscriptionsModule() && !hasOrganizationsModule(),
    []
  );
  const { pathname } = useLocation();

  return (
    <BaseAuthedPage>
      <Tabs selectedKey={pathname}>
        <Tab
          id="profile"
          title="Profile"
          href={tabTo(baseOwnerPath, 'profile')}
        />
        <Tab id="password" title="Password" href="password" />
        {showSubscriptions && (
          <Tab id="subscription" title="Subscription" href="subscription" />
        )}
      </Tabs>
      <div className="mt-4">
        <Routes>
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/password" element={<ChangePassword />} />
          {showSubscriptions && (
            <Route
              path="/subscription"
              element={<Subscription status={status} session_id={session_id} />}
            />
          )}
        </Routes>
      </div>
    </BaseAuthedPage>
  );
};
