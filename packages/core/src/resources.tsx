import { useCallback, useMemo } from 'react';
import { useRhinoContext } from './RhinoContext';
import { isBaseOwned } from './utils/models';
import { RhinoResource } from './index';
import { Resources } from './index';

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
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    console.error(`Model ${String(resource)} not found`);

  return resources[0];
};

export const useBaseOwnedResources = () =>
  useResources({ filter: isBaseOwned });
