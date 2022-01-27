import { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { BaseOwnerContext } from 'rhino/contexts/BaseOwnerContext';

export const useBaseOwnerContext = () => {
  return useContext(BaseOwnerContext);
};

export const useBaseOwner = () => {
  const { baseOwner } = useBaseOwnerContext();

  return baseOwner;
};

export const useBaseOwnerId = () => {
  const routeParams = useParams();

  return parseInt(routeParams.baseOwnerId);
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

  return useMemo(() => roles.some((el) => roleList.includes(el)), [
    roles,
    roleList
  ]);
};
