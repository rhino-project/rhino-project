import { NavItem, NavSection } from 'rhino/components/nav';
import { ENABLE_MODEL_ROUTES } from 'config';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import routePaths from 'rhino/routes';
import { getBaseOwnedModels } from 'rhino/utils/models';
import { useBaseOwnerPath } from 'rhino/hooks/history';
import CustomPrimaryNavigation from 'components/app/CustomPrimaryNavigation';

const modelsRoute = (model) => routePaths[model.name].index();

const useNavModels = () => {
  const models = getBaseOwnedModels();
  return useMemo(() => models, [models]);
};

const PrimaryNavigation = ({ title = 'Resources', className, itemClass }) => {
  const baseOwnerPath = useBaseOwnerPath();
  const models = useNavModels().filter(
    (e) => e.model !== 'users_role' && e.model !== 'users_role_invite'
  );

  return (
    <>
      <CustomPrimaryNavigation className={className} itemClass={itemClass} />
      {ENABLE_MODEL_ROUTES && (
        <NavSection title={title} className={className}>
          {map(models, (m) => (
            <NavItem
              key={m.model}
              title={m.pluralReadableName}
              to={baseOwnerPath.build(modelsRoute(m))}
              icon="list"
              extraClass={itemClass}
            />
          ))}
        </NavSection>
      )}
    </>
  );
};

export default PrimaryNavigation;

PrimaryNavigation.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  itemClass: PropTypes.string
};
