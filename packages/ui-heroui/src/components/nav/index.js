import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';

import { NavIcon } from '../icons';
import { useGlobalComponent, useRoles } from '@rhino-project/core/hooks';
import {
  getBaseOwnedModels,
  getModel,
  getModelIndexPath
} from '@rhino-project/core/utils';
import { useMemo } from 'react';
import { map, uniqBy } from 'lodash-es';

export const NavSection = ({
  title,
  icon,
  onIconClick,
  children,
  className
}) => {
  return (
    <li data-slot="base" role="presentation" className="relative mb-2 w-full">
      {title && (
        <span
          role="presentation"
          className="pl-1 text-tiny text-primary-foreground/80"
        >
          {title}
        </span>
      )}
      <ul>{children}</ul>
    </li>
  );
};

NavSection.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  onIconClick: PropTypes.func,
  className: PropTypes.string
};

export const NavItem = ({ title, icon, extraClass, ...props }) => {
  return (
    <RRNavLink {...props}>
      <div className="flex group gap-2 items-center justify-between relative py-1.5 w-full box-border subpixel-antialiased cursor-pointer tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 data-[focus-visible=true]:dark:ring-offset-background-content1 hover:transition-colors hover:text-default-foreground data-[selectable=true]:focus:bg-default/40 data-[selectable=true]:focus:text-default-foreground px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-primary-400 dark:data-[selected=true]:bg-primary-300 hover:bg-primary-300/20 dark:hover:bg-primary-300/40">
        {icon && <NavIcon icon={icon} />}
        <span className="flex-1 truncate text-small font-medium text-primary-foreground/60 group-data-[selected=true]:text-primary-foreground">
          {title}
        </span>
      </div>
    </RRNavLink>
  );
};

NavItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  extraClass: PropTypes.string
};

const modelsRoute = (model) => getModelIndexPath(model);

export const ModelNavSectionBase = ({
  title = 'Resources',
  className,
  itemClass,
  models = null
}) => {
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
    <NavSection title={title} className={className}>
      {map(fullModels, (m) => (
        <NavItem
          key={m.model}
          title={m.pluralReadableName}
          to={modelsRoute(m)}
          icon="bi:list"
          extraClass={itemClass}
        />
      ))}
    </NavSection>
  );
};

ModelNavSectionBase.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  itemClass: PropTypes.string
};

export const ModelNavSection = (props) =>
  useGlobalComponent('ModelNavSection', ModelNavSectionBase, props);
