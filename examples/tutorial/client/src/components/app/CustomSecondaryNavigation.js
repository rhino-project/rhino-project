import { NavItem } from '@rhino-project/core/components/nav';
import { useRhinoConfig } from '@rhino-project/config';

const CustomSecondaryNavigation = () => {
  const {
    env: { DESIGN_SYSTEM_ENABLED }
  } = useRhinoConfig();

  return (
    <>
      {DESIGN_SYSTEM_ENABLED && (
        <NavItem
          key="design-system"
          title="Design System"
          to="__design"
          icon="list"
          className="px-3"
        />
      )}
    </>
  );
};

export default CustomSecondaryNavigation;
