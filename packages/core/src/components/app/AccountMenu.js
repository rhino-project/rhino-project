import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';

import { NavIcon } from 'rhino/components/icons';
import { useUser } from 'rhino/hooks/auth';
import { useBaseOwnerPath } from 'rhino/hooks/history';
import { useBaseOwner, useHasRoleOf } from 'rhino/hooks/owner';
import { useAccountSettingsPath, useSettingsPath } from 'rhino/hooks/routes';
import { useSignOutAction } from 'rhino/queries/auth';
import { hasOrganizationsModule } from 'rhino/utils/models';

const OrganizationSettings = () => {
  const baseOwner = useBaseOwner();
  const baseOwnerPath = useBaseOwnerPath();
  const settingsPath = useSettingsPath();

  return (
    <>
      <DropdownItem divider />
      <DropdownItem
        tag={NavLink}
        to={baseOwnerPath.build(`${settingsPath}/profile`)}
      >
        {baseOwner?.name} Settings
      </DropdownItem>
    </>
  );
};

const AccountMenu = () => {
  const { mutate: signOutAction } = useSignOutAction();
  const user = useUser();
  const baseOwnerPath = useBaseOwnerPath();
  const accountSettingsPath = useAccountSettingsPath();
  const isAdmin = useHasRoleOf('admin');
  const showOrgSettings = useMemo(
    () => hasOrganizationsModule() && isAdmin,
    [isAdmin]
  );

  return (
    <UncontrolledDropdown nav direction="up">
      <DropdownToggle
        id="account-menu"
        className="d-flex align-items-center text-light no-arrow"
        nav
        caret
      >
        <NavIcon icon="person-circle" extraClass="flex-shrink-0" />
        <span className="d-block mx-2 text-truncate flex-grow-1">
          {user?.nickname || user?.name?.split(' ')[0]}
        </span>
        <NavIcon icon="chevron-down" extraClass="flex-shrink-0" />
      </DropdownToggle>
      <DropdownMenu dark end>
        <DropdownItem
          id="account-settings"
          tag={NavLink}
          to={baseOwnerPath.build(`${accountSettingsPath}/profile`)}
        >
          Account Settings
        </DropdownItem>
        {showOrgSettings && <OrganizationSettings />}
        <DropdownItem divider />
        <DropdownItem id="account-signout" onClick={signOutAction}>
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default AccountMenu;
