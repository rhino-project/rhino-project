import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';

import { NavIcon } from '../icons';
import { useUser } from '../../hooks/auth';
import { useBaseOwner, useHasRoleOf } from '../../hooks/owner';
import { useAccountSettingsPath, useSettingsPath } from '../../hooks/routes';
import { useSignOutAction } from '../../queries/auth';
import { hasOrganizationsModule } from '../../utils/models';

const OrganizationSettings = () => {
  const baseOwner = useBaseOwner();
  const settingsPath = useSettingsPath();

  return (
    <>
      <DropdownItem divider />
      <DropdownItem tag={NavLink} to={`${settingsPath}/profile`}>
        {baseOwner?.name} Settings
      </DropdownItem>
    </>
  );
};

export const AccountMenu = () => {
  const { mutate: signOutAction } = useSignOutAction();
  const user = useUser();
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
          to={`${accountSettingsPath}/profile`}
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
