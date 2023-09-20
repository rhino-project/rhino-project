import CustomPrimaryNavigation from 'components/app/CustomPrimaryNavigation';
import { ENABLE_MODEL_ROUTES } from 'config';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { NavItem, NavSection } from 'rhino/components/nav';
import { getBaseOwnedModels } from 'rhino/utils/models';
import { getModelIndexPath } from 'rhino/utils/routes';

const modelsRoute = (model) => getModelIndexPath(model);

const useNavModels = () => {
  const models = getBaseOwnedModels();
  return useMemo(() => models, [models]);
};

const PrimaryNavigation = ({ title = 'Resources', className, itemClass }) => {
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
              to={modelsRoute(m)}
              icon="list"
              className="px-3"
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
