import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import { useSignOutAction } from 'rhino/queries/auth';
import { NavIcon } from 'rhino/components/icons';
import { useBaseOwnerPath } from 'rhino/hooks/history';
import { useBaseOwner, useHasRoleOf } from 'rhino/hooks/owner';
import { useUser } from 'rhino/hooks/auth';
import { hasOrganizationsModule } from 'rhino/utils/models';
import { useAccountSettingsPath, useSettingsPath } from 'rhino/hooks/routes';

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

const AccountMenu = ({ sidebarMode = false }) => {
  const { mutate: signOutAction } = useSignOutAction();
  const user = useUser();
  const baseOwnerPath = useBaseOwnerPath();
  const accountSettingsPath = useAccountSettingsPath();
  const isAdmin = useHasRoleOf('admin');
  const showOrgSettings = useMemo(() => hasOrganizationsModule() && isAdmin, [
    isAdmin
  ]);

  return (
    <UncontrolledDropdown
      nav={sidebarMode}
      inNavbar={sidebarMode}
      direction={sidebarMode ? 'up' : 'down'}
    >
      <DropdownToggle
        id="account-menu"
        className="d-flex align-items-center"
        nav
        caret
      >
        <NavIcon icon="person-circle" extraClass="flex-shrink-0" />
        <span
          className={classnames('d-block', 'overflow-hidden', 'flex-grow-1', {
            'd-md-none': !sidebarMode
          })}
        >
          {user?.nickname || user?.name?.split(' ')[0]}
        </span>
      </DropdownToggle>
      <DropdownMenu end>
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

AccountMenu.propTypes = {
  sidebarMode: PropTypes.bool
};
