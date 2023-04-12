import { useMemo } from 'react';
import { useRoles } from './owner';

export const usePaths = (paths, resource) => {
  const roles = useRoles();
  return useMemo(() => {
    let computedPaths = [];
    if (Array.isArray(paths)) {
      computedPaths = paths;
    } else if (typeof paths === 'function') {
      computedPaths = paths(roles, resource);
    }

    return computedPaths;
  }, [roles, resource, paths]);
};
