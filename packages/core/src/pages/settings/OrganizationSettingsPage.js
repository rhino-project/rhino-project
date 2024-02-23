import { useMemo } from 'react';
import { TabContent, TabPane, Nav } from 'reactstrap';

import BaseAuthedPage from '../BaseAuthedPage';
import EditOrganizationProfile from '../../components/settings/EditOrganizationProfile';
import EditOrganizationAccess from '../../components/settings/EditOrganizationAccess';
import Subscription from '../../components/settings/Subscription';
import { useBaseOwnerPath, useParsedSearch } from '../../hooks/history';
import { hasOrganizationsModule, hasSubscriptionsModule } from '../../utils/models';
import { NavItem } from '../../components/nav';
import { useParams } from 'react-router-dom';
import { getSettingsPath } from '../../utils/routes';

const tabTo = (baseOwnerPath, tabId) =>
  baseOwnerPath.build(`${getSettingsPath()}/${tabId}`);

export const SettingsPage = () => {
  //Checking subscription payment related status
  const { status, session_id } = useParsedSearch(); //FIXME use session_id for checking later
  const baseOwnerPath = useBaseOwnerPath();

  const showSubscriptions = useMemo(
    () => hasSubscriptionsModule() && hasOrganizationsModule(),
    []
  );

  const { activeTab } = useParams();

  return (
    <BaseAuthedPage>
      <Nav tabs>
        <NavItem title="Profile" to={tabTo(baseOwnerPath, 'profile')} />
        <NavItem title="Access" to={tabTo(baseOwnerPath, 'access')} />
        {showSubscriptions && (
          <NavItem
            title="Subscription"
            to={tabTo(baseOwnerPath, 'subscription')}
          />
        )}
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="profile">
          <EditOrganizationProfile />
        </TabPane>
        <TabPane tabId="access">
          <EditOrganizationAccess />
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
