import { useCallback, useMemo } from 'react';
import { useRhinoContext } from '../contexts/RhinoContext';
import { isBaseOwned } from '../utils';
import { RhinoResource } from '..';
import { Resources } from '..';

const identity = () => true;

export const useResources = ({
  filter = identity
}: {
  filter: (value: RhinoResource) => boolean;
}) => {
  const { resources } = useRhinoContext() as unknown as {
    resources: Record<string, RhinoResource>;
  };

  const filteredResources = useMemo(
    () =>
      Object.entries(resources)
        .filter(([, resource]) => filter(resource))
        .map(([, resource]) => resource),
    [filter, resources]
  );

  return filteredResources;
};

export const useResource = <T extends keyof Resources>(
  resource: T | RhinoResource
) => {
  const filter = useCallback(
    (value: RhinoResource) =>
      typeof resource === 'string'
        ? value.model === resource
        : value.model === resource.model,
    [resource]
  );

  const resources = useResources({ filter });

  if (resources.length === 0)
    console.error(`Model ${String(resource)} not found`);

  return resources[0];
};

export const useBaseOwnedResources = () =>
  useResources({ filter: isBaseOwned });
