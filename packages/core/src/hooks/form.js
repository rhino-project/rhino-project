import { useCallback, useEffect, useMemo, useState } from 'react';
import { cloneDeep, merge } from 'lodash';

export const useControlledForm = (resource) => {
  const [values, setValues] = useState(resource);
  const [errors, setErrors] = useState(null);

  const handleChange = useCallback(
    (formValues) => setValues((values) => merge(cloneDeep(values), formValues)),
    []
  );

  // Merge in the resource values
  useEffect(() => handleChange(resource), [resource, handleChange]);

  return [values, setValues, errors, setErrors, handleChange];
};

export const useComputedPaths = (model, paths, getDefaultAttributes) => {
  const computedPaths = useMemo(() => {
    if (paths) return paths;

    return (
      getDefaultAttributes(model)
        // Do not include the owner
        .filter((a) => a.name !== model.ownedBy)
        .map((a) => a.name)
    );
  }, [model, paths, getDefaultAttributes]);

  return computedPaths;
};
