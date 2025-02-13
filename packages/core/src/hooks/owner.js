import { merge } from 'lodash-es';
import { createContext, useMemo } from 'react';
import { getBaseOwnerFilters } from '../utils/models';
import { useModel } from './models';
import { useRhinoContext } from '..';

export const BaseOwnerContext = createContext({
  baseOwner: null,
  resolving: true,
  usersRoles: []
});

export const useBaseOwner = () => {
  const { baseOwner } = useRhinoContext();

  return baseOwner;
};

export const useBaseOwnerId = () => {
  const baseOwner = useBaseOwner();

  return useMemo(() => parseInt(baseOwner?.id), [baseOwner?.id]);
};

export const useBaseOwnerFilters = (model, options = {}) => {
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
    let roles = [];
    if (baseOwner && Array.isArray(usersRoles)) {
      roles = usersRoles
        .filter((ur) => ur.organization?.id === baseOwner.id)
        .map((ur) => ur.role?.name)
        .filter(Boolean);
    }
    return roles;
  }, [usersRoles, baseOwner]);
};

export const useUserRoles = () => {
  const { usersRoles } = useRhinoContext();

  return usersRoles;
};

export const useHasRoleOf = (role) => {
  const roles = useRoles();

  return useMemo(() => roles.some((el) => el === role), [roles, role]);
};

export const useHasRoleIn = (roleList) => {
  const roles = useRoles();

  return useMemo(
    () => roles.some((el) => roleList.includes(el)),
    [roles, roleList]
  );
};

export const useUsersRoleWithRole = (role) => {
  const usersRoles = useUserRoles();

  return useMemo(
    () => usersRoles.find((el) => el.role?.name === role),
    [usersRoles, role]
  );
};
