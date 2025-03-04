import { useMemo } from 'react';

import {
  useBaseOwner,
  useHasRoleOf,
  useUser,
  useAccountSettingsPath,
  useSettingsPath
} from '@rhino-project/core/hooks';
import { useSignOutAction } from '@rhino-project/core/queries';
import { hasOrganizationsModule } from '@rhino-project/core/utils';
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  User
} from '@heroui/react';
import { useBaseOwnerPath } from '../../hooks';

export const AccountMenu = () => {
  const { mutate: signOutAction } = useSignOutAction();
  const user = useUser();
  const accountSettingsPath = useAccountSettingsPath();
  const isAdmin = useHasRoleOf('admin');
  const showOrgSettings = useMemo(
    () => hasOrganizationsModule() && isAdmin,
    [isAdmin]
  );
  const baseOwner = useBaseOwner();
  const { build } = useBaseOwnerPath();
  const settingsPath = useSettingsPath();

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        {/* FIXME: Add avatar src */}
        <User
          as="button"
          className="transition-transform"
          description={user?.nickname || user?.name}
          name={user?.email}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions">
        <DropdownItem key="settings" href={build(accountSettingsPath)}>
          Settings
        </DropdownItem>
        {showOrgSettings && (
          <DropdownItem key="org_settings" href={build(settingsPath)}>
            {baseOwner?.name} Settings
          </DropdownItem>
        )}
        <DropdownItem key="logout" color="danger" onPress={signOutAction}>
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
