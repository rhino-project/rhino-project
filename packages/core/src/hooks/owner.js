import { merge } from 'lodash-es';
import { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getBaseOwnerFilters } from '../utils/models';
import { useModel } from './models';

export const BaseOwnerContext = createContext({
  baseOwner: null,
  resolving: true,
  usersRoles: []
});

export const useBaseOwnerContext = () => {
  return useContext(BaseOwnerContext);
};

export const useBaseOwner = () => {
  const { baseOwner } = useBaseOwnerContext();

  return baseOwner;
};

export const useBaseOwnerId = () => {
  const { baseOwnerId } = useParams();

  return useMemo(() => parseInt(baseOwnerId), [baseOwnerId]);
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
  const { usersRoles, baseOwner } = useBaseOwnerContext();
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
  const { usersRoles } = useBaseOwnerContext();

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
