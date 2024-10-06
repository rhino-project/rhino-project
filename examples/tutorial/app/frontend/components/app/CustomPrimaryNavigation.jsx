import PropTypes from 'prop-types';

import { NavItem, NavSection } from '@rhino-project/core/components/nav';

const CustomPrimaryNavigation = ({ className, itemClass }) => {
  return (
    <NavSection className={className}>
      <NavItem
        title="Dashboard"
        icon="house"
        to="."
        end
        extraClass={itemClass}
      />
    </NavSection>
  );
};

export default CustomPrimaryNavigation;

CustomPrimaryNavigation.propTypes = {
  className: PropTypes.string,
  itemClass: PropTypes.string
};
