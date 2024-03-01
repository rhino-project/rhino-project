import CustomPrimaryNavigation from 'components/app/CustomPrimaryNavigation';
import { map, uniqBy } from 'lodash-es';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { NavItem, NavSection } from '../nav';
import { useRhinoConfig } from '@rhino-project/config';
import { getBaseOwnedModels, getModel } from '../../utils/models';
import { getModelIndexPath } from '../../utils/routes';
import { useRoles } from '../../hooks';

const modelsRoute = (model) => getModelIndexPath(model);

export const PrimaryNavigation = ({
  title = 'Resources',
  className,
  itemClass,
  models = null
}) => {
  const { enableModelRoutes } = useRhinoConfig();
  const roles = useRoles();

  const fullModels = useMemo(() => {
    if (!models) {
      return getBaseOwnedModels().filter(
        (m) => m.model !== 'users_role' && m.model !== 'users_role_invite'
      );
    }

    let generatedModels = models;
    if (typeof models === 'function') {
      generatedModels = models(roles);
    }

    if (Array.isArray(generatedModels)) {
      return generatedModels.map((m) => getModel(m));
    } else if (typeof generatedModels === 'object') {
      return uniqBy(
        roles.reduce((previousValue, roleName) => {
          if (models[roleName]) {
            return [...previousValue, ...models[roleName]];
          }
          return previousValue;
        }, []),
        (model) => model
      ).map((m) => getModel(m));
    }

    console.warn('Invalid models passed to PrimaryNavigation', models);
  }, [models, roles]);

  return (
    <>
      <CustomPrimaryNavigation className={className} itemClass={itemClass} />
      {enableModelRoutes && (
        <NavSection title={title} className={className}>
          {map(fullModels, (m) => (
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
