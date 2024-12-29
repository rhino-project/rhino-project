import { Icon } from '@iconify/react';
import {
  useBaseOwnerNavigation,
  useBaseOwner,
  useBaseOwnerId,
  useUserRoles,
  useRootPath
} from '@rhino-project/core/hooks';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu
} from '@heroui/react';

export const BaseOwnerSwitcher = () => {
  const baseOwnerId = useBaseOwnerId();
  const baseOwnerNavigation = useBaseOwnerNavigation();
  const usersRoles = useUserRoles();
  const baseOwner = useBaseOwner();
  const rootPath = useRootPath();

  // Only show the dropdown if there is more than one possible base owner
  if (!baseOwnerId || !usersRoles || usersRoles.length <= 1) {
    return null;
  }

  const handleClick = (baseOwnerClicked) =>
    baseOwnerNavigation.push(rootPath, baseOwnerClicked.id);

  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <Button
            variant="bordered"
            startContent={<Icon className="size-4" icon="bi:building" />}
            endContent={<Icon className="size-4" icon="bi:chevron-expand" />}
          >
            {baseOwner?.name}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          {usersRoles.map((ur) => (
            <DropdownItem
              key={ur.organization.id}
              onClick={() => handleClick(ur.organization)}
            >
              {ur.organization.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
