import { Icon } from '@iconify/react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu
} from '@heroui/react';
import { useRhinoContext } from '@rhino-project/core';
import { useRouter } from '@tanstack/react-router';

export const BaseOwnerSwitcher = () => {
  const { baseOwner, usersRoles } = useRhinoContext();
  const router = useRouter();

  // Only show the dropdown if there is more than one possible base owner
  if (!baseOwner?.id || !usersRoles || usersRoles.length <= 1) return null;

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
              onPress={() =>
                router.navigate({
                  to: '/$owner',
                  params: { owner: ur.organization.id }
                })
              }
            >
              {ur.organization.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
