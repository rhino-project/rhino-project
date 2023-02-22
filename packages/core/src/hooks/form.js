import { useCallback, useEffect, useMemo, useState } from 'react';
import { assign, cloneDeep, get } from 'lodash';
import { useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export const useControlledForm = (resource) => {
  const [values, setValues] = useState(resource);
  const [errors, setErrors] = useState(null);

  const handleChange = useCallback(
    (formValues) =>
      setValues((values) => assign(cloneDeep(values), formValues)),
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

export const useFieldPlaceholder = (props) => {
  const { label, placeholder } = props;

  return useMemo(() => placeholder || label, [label, placeholder]);
};

export const useFieldInheritedProps = (
  props,
  options = { prefix: null, className: null }
) => {
  // id and classes should not be inherited down a component tree
  const { id, className, ...inheritedProps } = props;

  const propReturns = useMemo(() => {
    const extractedProps = {
      id: id || [options.prefix, props.path].filter(Boolean).join('-'),
      className: [options.className, className].filter(Boolean).join(' ')
    };

    return {
      ...extractedProps,
      extractedProps,
      inheritedProps
    };
  }, [
    id,
    options.prefix,
    className,
    options.className,
    props.path,
    inheritedProps
  ]);

  return propReturns;
};

export const useFieldSetErrors = (setError = null) => {
  const formContext = useFormContext();

  return useCallback(
    (error) => {
      const realSetError = setError || formContext.setError;

      Object.keys(error.errors).forEach((name) =>
        realSetError(name, {
          type: 'manual',
          message: error.errors[name][0]
        })
      );
    },
    [setError, formContext?.setError]
  );
};

export const useFieldRegister = (path, options = {}) => {
  const { register } = useFormContext();

  return register(path, options);
};

export const useFieldError = (path) => {
  const {
    formState: { errors }
  } = useFormContext();

  const error = useMemo(() => get(errors, path), [errors, path]);

  return error;
};

export const useResolver = (schema) => {
  const resolver = useMemo(() => yupResolver(schema), [schema]);

  return resolver;
};
