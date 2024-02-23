import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';
import { NavIcon } from 'rhino/components/icons';
import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import { useBaseOwner, useBaseOwnerId, useUserRoles } from 'rhino/hooks/owner';
import { useRootPath } from 'rhino/hooks/routes';

const BaseOwnerSwitcher = () => {
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
    <UncontrolledDropdown nav direction="up">
      <DropdownToggle
        nav
        caret
        className="d-flex align-items-center text-light no-arrow"
      >
        <NavIcon icon="building" extraClass="flex-shrink-0" />
        <span className="d-block ms-2 overflow-hidden flex-grow-1">
          {baseOwner?.name}
        </span>
        <NavIcon icon="chevron-down" extraClass="flex-shrink-0" />
      </DropdownToggle>
      <DropdownMenu dark end>
        {usersRoles.map((ur) => (
          <DropdownItem
            key={ur.organization.id}
            onClick={() => handleClick(ur.organization)}
          >
            {ur.organization.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default BaseOwnerSwitcher;
