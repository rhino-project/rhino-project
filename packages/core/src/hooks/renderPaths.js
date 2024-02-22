import { Children, cloneElement, isValidElement, useMemo } from 'react';
import ModelFieldGroup from '../components/models/ModelFieldGroup';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paths, props]
  );

  return renderPaths;
};
