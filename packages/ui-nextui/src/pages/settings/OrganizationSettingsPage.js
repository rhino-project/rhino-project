import { useMemo } from 'react';

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

const tabTo = (baseOwnerPath, tabId) =>
  baseOwnerPath.build(`${getSettingsPath()}/${tabId}`);

export const OrganizationSettingsPage = () => {
  //Checking subscription payment related status
  const { status, session_id } = useParsedSearch(); //FIXME use session_id for checking later
  const baseOwnerPath = useBaseOwnerPath();

  const showSubscriptions = useMemo(
    () => hasSubscriptionsModule() && hasOrganizationsModule(),
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
        <Tab id="access" title="Access" href="access" />
        {showSubscriptions && (
          <Tab id="subscription" title="Subscription" href="subscription" />
        )}
      </Tabs>
      <div className="mt-4">
        <Routes>
          <Route path="/profile" element={<EditOrganizationProfile />} />
          <Route path="/access" element={<EditOrganizationAccess />} />
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
