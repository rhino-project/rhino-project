import { isObject, uniqBy } from 'lodash';
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
    } else if (isObject(paths)) {
      return uniqBy(
        roles.reduce((previousValue, roleName) => {
          if (paths[roleName]) {
            return [...previousValue, ...paths[roleName]];
          }
          return previousValue;
        }, []),
        (path) => path
      );
    }
    return computedPaths;
  }, [paths, roles, resource]);
};
