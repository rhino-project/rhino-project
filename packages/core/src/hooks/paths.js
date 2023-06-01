import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { useRoles } from './owner';
import ModelFieldGroup from 'rhino/components/models/ModelFieldGroup';

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

export const useRenderPaths = (paths, options) => {
  const { Component = ModelFieldGroup, props } = options;

  const renderPaths = useMemo(
    () =>
      Children.map(paths, (path) =>
        isValidElement(path) ? (
          cloneElement(path, props)
        ) : (
          <Component path={path} {...props} />
        )
      ),
    [paths, props]
  );

  return renderPaths;
};
