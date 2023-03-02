import { useCallback, useEffect, useMemo, useState } from 'react';
import { assign, cloneDeep, compact, get, omit } from 'lodash';
import { useController, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getModelAndAttributeFromPath } from 'rhino/utils/models';
import { useModel } from './models';

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

export const useFilterPill = (path) => {
  const { getValues, setValue } = useFormContext();

  const setPill = useCallback(
    (value) =>
      setValue(
        'pills',
        { ...getValues('pills'), [path]: value },
        { shouldDirty: true }
      ),
    [getValues, setValue, path]
  );

  const resetPill = useCallback(() => {
    setValue('pills', omit({ ...getValues('pills') }, path));
  }, [getValues, setValue, path]);

  return { resetPill, setPill };
};

export const useFilterPills = ({ control }) => {
  const methods = useFormContext();
  const {
    field: { value: pills, onChange }
  } = useController({
    name: 'pills',
    control: control || methods.control,
    defaultValue: {}
  });

  // FIXME: Resetting the last pill does not clear the dirty
  const resetPill = useCallback((path) => onChange(omit(pills, path)), [
    pills,
    onChange
  ]);

  // FIXME: Unclear why i have to reset to {} explicitly to clear the dirty
  const resetPills = useCallback(() => onChange({}), [onChange]);

  return { pills, resetPill, resetPills };
};

export const useFilterField = (path, operator, options = {}) => {
  const operatorPath = useMemo(() => compact([path, operator]).join('.'), [
    path,
    operator
  ]);

  // FIXME: Include useFilterPill here? There may be cases where it is not needed or even a problem like in ModelFilterReference

  return { operatorPath };
};

export const useModelFilterField = (model, path, options = {}) => {
  const memoModel = useModel(model);

  const [attributeModel, attribute, operator, plainPath] = useMemo(
    () => getModelAndAttributeFromPath(memoModel, path),
    [memoModel, path]
  );

  const filterField = useFilterField(plainPath, operator, options);

  // FIXME: Memoize this?
  return { attribute, attributeModel, operator, plainPath, ...filterField };
};
