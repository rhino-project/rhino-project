import classnames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavLink, NavItem as RSNavItem } from 'reactstrap';

import { NavIcon } from '../icons';
import { useGlobalComponent, useRoles } from '../../hooks';
import { getBaseOwnedModels, getModel, getModelIndexPath } from '../../utils';
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
    <div className={className}>
      {title && (
        <div className="nav-sidebar-section d-flex justify-content-between align-items-center px-0 mt-3 mb-1 text-capitalize text-gray-400">
          <span className="fw-medium">{title}</span>
          {icon && <NavIcon role="button" icon={icon} onClick={onIconClick} />}
        </div>
      )}
      <ul className="nav flex-column">{children}</ul>
    </div>
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
    <RSNavItem>
      <NavLink
        tag={RRNavLink}
        className={classnames(
          'd-flex',
          'flex-row',
          'align-items-center',
          'justify-content-start',
          extraClass
        )}
        {...props}
      >
        <div className="d-flex align-items-center">
          {icon && <NavIcon icon={icon} />}
          <div className={classnames({ 'ms-2': icon })}>{title}</div>
        </div>
      </NavLink>
    </RSNavItem>
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
          icon="list"
          className="px-3"
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
