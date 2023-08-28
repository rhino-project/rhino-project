import { NavIcon } from 'rhino/components/icons';
import { useBaseOwner, useBaseOwnerId, useUserRoles } from 'rhino/hooks/owner';
import PropTypes from 'prop-types';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';
import { useBaseOwnerNavigation } from 'rhino/hooks/history';
import { useRootPath } from 'rhino/hooks/routes';

const BaseOwnerSwitcher = ({ sidebarMode = false }) => {
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
    <UncontrolledDropdown nav inNavbar direction={sidebarMode ? 'up' : 'down'}>
      <DropdownToggle nav caret className="d-flex align-items-center">
        <NavIcon icon="building" extraClass="flex-shrink-0" />
        <span className="d-block overflow-hidden flex-grow-1">
          {baseOwner?.name}
        </span>
      </DropdownToggle>
      <DropdownMenu end={sidebarMode ? false : true}>
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

BaseOwnerSwitcher.propTypes = {
  baseOwner: PropTypes.object
};

export default BaseOwnerSwitcher;

BaseOwnerSwitcher.propTypes = {
  sidebarMode: PropTypes.bool
};
