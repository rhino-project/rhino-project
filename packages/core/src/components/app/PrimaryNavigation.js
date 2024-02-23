import { map } from 'lodash-es';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { NavItem, NavSection } from '../nav';
import { useRhinoConfig, CustomPrimaryNavigation } from '@rhino-project/config';
import { getBaseOwnedModels } from '../../utils/models';
import { getModelIndexPath } from '../../utils/routes';

const modelsRoute = (model) => getModelIndexPath(model);

const useNavModels = () => {
  const models = getBaseOwnedModels();
  return useMemo(() => models, [models]);
};

export const PrimaryNavigation = ({
  title = 'Resources',
  className,
  itemClass
}) => {
  const { enableModelRoutes } = useRhinoConfig();
  const models = useNavModels().filter(
    (e) => e.model !== 'users_role' && e.model !== 'users_role_invite'
  );

  return (
    <>
      <CustomPrimaryNavigation className={className} itemClass={itemClass} />
      {enableModelRoutes && (
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

PrimaryNavigation.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  itemClass: PropTypes.string
};
