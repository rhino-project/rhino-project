import { merge } from 'lodash-es';
import { useMemo } from 'react';
import { getBaseOwnerFilters } from '../utils/models';
import { useModel } from './models';
import { RhinoResourceSpecifier, useRhinoContext } from '..';

export const useBaseOwner = () => {
  const { baseOwner } = useRhinoContext();

  return baseOwner;
};

export const useBaseOwnerId = () => {
  const baseOwner = useBaseOwner();

  return useMemo(() => Number(baseOwner?.id), [baseOwner?.id]);
};

export const useBaseOwnerFilters = (
  model: RhinoResourceSpecifier,
  options: { extraFilters?: Record<string, unknown> } = {}
) => {
  const baseOwnerId = useBaseOwnerId();
  const { extraFilters } = options;
  const modelObject = useModel(model);

  return useMemo(
    () => merge(getBaseOwnerFilters(modelObject, baseOwnerId), extraFilters),
    [baseOwnerId, extraFilters, modelObject]
  );
};

export const useRoles = () => {
  const { usersRoles, baseOwner } = useRhinoContext();

  return useMemo(() => {
    return baseOwner && Array.isArray(usersRoles)
      ? usersRoles
          .filter((ur) => ur.organization?.id === baseOwner.id)
          .map((ur) => ur.role?.name)
          .filter(Boolean)
      : [];
  }, [usersRoles, baseOwner]);
};

export const useUserRoles = () => {
  const { usersRoles } = useRhinoContext();

  return usersRoles;
};

export const useHasRoleOf = (role: string) => {
  const roles = useRoles();

  return useMemo(() => roles.some((el) => el === role), [roles, role]);
};

export const useHasRoleIn = (roleList: string[]) => {
  const roles = useRoles();

  return useMemo(
    () => roles.some((el) => roleList.includes(el)),
    [roles, roleList]
  );
};

export const useUsersRoleWithRole = (role: string) => {
  const usersRoles = useUserRoles();

  return useMemo(
    () => usersRoles.find((el) => el.role?.name === role),
    [usersRoles, role]
  );
};
