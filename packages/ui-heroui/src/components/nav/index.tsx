import { NavIcon } from '../icons';
import { useBaseOwnerId, useGlobalComponent, useRoles } from '@rhino-project/core/hooks';
import { getBaseOwnedModels, getModel } from '@rhino-project/core/utils';
import { ReactNode, useMemo } from 'react';
import { map, uniqBy } from 'lodash-es';
import { Link, LinkProps } from '@tanstack/react-router';
import { RhinoResourceName } from '@rhino-project/core';

export type NavSectionProps = {
  title?: string;
  children: ReactNode;
};

export const NavSection = ({ title, children }: NavSectionProps) => {
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

export type NavItemProps = {
  title: string;
  icon: string;
} & LinkProps;

export const NavItem = ({ title, icon, ...props }: NavItemProps) => {
  return (
    <Link {...props}>
      <div className="flex gap-2 items-center justify-between relative py-1.5 w-full box-border subpixel-antialiased cursor-pointer tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 data-[focus-visible=true]:dark:ring-offset-background-content1 hover:transition-colors hover:text-default-foreground data-[selectable=true]:focus:bg-default/40 data-[selectable=true]:focus:text-default-foreground px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-primary-400 dark:data-[selected=true]:bg-primary-300 hover:bg-primary-300/20 dark:hover:bg-primary-300/40 [.active_&]:bg-primary-300/20 dark:[.active_&]:bg-primary-300/40">
        {icon && <NavIcon icon={icon} />}
        <span className="flex-1 truncate text-small font-medium text-primary-foreground/60 group-data-[selected=true]:text-primary-foreground">
          {title}
        </span>
      </div>
    </Link>
  );
};

export type ModelNavSectionProps = {
  title?: string;
  models?:
    | RhinoResourceName[]
    | ((roles: string[]) => RhinoResourceName[])
    | null;
};

export const ModelNavSectionBase = ({
  title = 'Resources',
  models = null
}: ModelNavSectionProps) => {
  const roles = useRoles();
  const ownerId = useBaseOwnerId();
  
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
        // @ts-expect-error FIXME: typing
        roles.reduce((previousValue, roleName) => {
          // @ts-expect-error FIXME: typing
          if (models[roleName]) {
            // @ts-expect-error FIXME: typing
            return [...previousValue, ...models[roleName]];
          }
          return previousValue;
        }, []),
        (model) => model
      ).map((m) => getModel(m));
    }

    console.warn('Invalid models passed to PrimaryNavigation', models);
    return [];
  }, [models, roles]);

  return (
    <NavSection title={title}>
      {map(fullModels, (m) => (
        <NavItem
          key={m.model}
          title={m.pluralReadableName}
          to={`/${ownerId}/${m.model}`}
          icon="bi:list"
        />
      ))}
    </NavSection>
  );
};

export const ModelNavSection = (props: ModelNavSectionProps) =>
  useGlobalComponent('ModelNavSection', ModelNavSectionBase, props);
