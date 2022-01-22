import { useMemo } from 'react';
import { TabContent, TabPane, Nav } from 'reactstrap';

import BaseAuthedPage from 'rhino/pages/BaseAuthedPage';
import ChangePassword from 'rhino/components/settings/ChangePassword';
import EditProfile from 'rhino/components/settings/EditProfile';
import Subscription from 'rhino/components/settings/Subscription';
import { useBaseOwnerPath, useParsedSearch } from 'rhino/hooks/history';
import {
  hasOrganizationsModule,
  hasSubscriptionsModule
} from 'rhino/utils/models';
import { NavItem } from 'rhino/components/nav';
import { useParams } from 'react-router-dom';
import routePaths from 'rhino/routes';

const tabTo = (baseOwnerPath, tabId) =>
  baseOwnerPath.build(`${routePaths.accountSettings()}/${tabId}`);

const SettingsPage = () => {
  //Checking subscription payment related status
  const { status, session_id } = useParsedSearch(); //FIXME use session_id for checking later
  const baseOwnerPath = useBaseOwnerPath();

  const showSubscriptions = useMemo(
    () => hasSubscriptionsModule() && !hasOrganizationsModule(),
    []
  );

  const { activeTab } = useParams();

  return (
    <BaseAuthedPage>
      <Nav tabs>
        <NavItem title="Profile" to={tabTo(baseOwnerPath, 'profile')} />
        <NavItem
          title="Change Password"
          to={tabTo(baseOwnerPath, 'password')}
        />
        {showSubscriptions && (
          <NavItem
            title="Subscription"
            to={tabTo(baseOwnerPath, 'subscription')}
          />
        )}
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="profile">
          <EditProfile />
        </TabPane>
        <TabPane tabId="password">
          <ChangePassword />
        </TabPane>
        {showSubscriptions && (
          <TabPane tabId="subscription">
            <Subscription status={status} session_id={session_id} />
          </TabPane>
        )}
      </TabContent>
    </BaseAuthedPage>
  );
};

export default SettingsPage;
