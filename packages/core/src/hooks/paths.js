import { useMemo } from 'react';
import { getModelAndAttributeFromPath } from 'rhino/utils/models';
import { useModel } from './models';
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

export const useModelAndAttributeFromPath = (model, path) => {
  const memoModel = useModel(model);

  return useMemo(() => {
    const [model, attribute] = getModelAndAttributeFromPath(memoModel, path);

    return { model, attribute };
  }, [memoModel, path]);
};
