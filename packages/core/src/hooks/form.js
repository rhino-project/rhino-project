import { useCallback, useEffect, useMemo, useState } from 'react';
import { assign, cloneDeep, compact, get, isString, toPath } from 'lodash-es';
import { useFormContext, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getModelAndAttributeFromPath } from '../utils/models';
import { useModel, useModelAndAttributeFromPath } from './models';
import { object } from 'yup';
import { yupValidatorsFromAttribute } from '../utils/yup';

export const useSchema = (model, paths, options = {}) => {
  const { yupSchemaFromAttribute = yupValidatorsFromAttribute } = options;

  const schema = useMemo(() => {
    let schema = object();

    paths?.forEach((path) => {
      if (!isString(path)) return;

      const [, attribute, , plainPath] = getModelAndAttributeFromPath(
        model,
        path
      );

      // Have to handle nested such as blog.user
      let subSchema = yupSchemaFromAttribute(attribute);

      const pathParts = toPath(plainPath);
      pathParts
        .slice(1)
        .reverse()
        .forEach((part) => {
          subSchema = object().shape({ [part]: subSchema });
        });

      schema = schema.shape({
        [pathParts[0]]: subSchema
      });
    });

    return schema;
  }, [model, paths, yupSchemaFromAttribute]);

  return schema;
};

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

  // Cannot memoize this because the errors object is a stable object
  return get(errors, path);
};

export const useModelFieldGroup = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  const label = useMemo(
    () => props?.label || attribute.readableName,
    [attribute, props?.label]
  );

  const placeholder = useMemo(
    () => props?.placeholder || label,
    [label, props?.placeholder]
  );

  return {
    attribute,
    model,
    fieldGroupProps: {
      label,
      nullable: attribute.nullable,
      placeholder,
      required: !!attribute['x-rhino-required'],
      ...props
    }
  };
};

export const useModelDisplayGroup = useModelFieldGroup;

export const useModelFieldGroupEnum = (props) => {
  const inputProps = useModelFieldGroup(props);
  const { attribute } = inputProps;

  const children = useMemo(
    () =>
      attribute.enum.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      )),
    [attribute]
  );

  const accessor = useCallback((value) => value || -1, []);
  const title = `${attribute.readableName}...`;

  return {
    ...inputProps,
    fieldGroupProps: {
      ...inputProps.fieldGroupProps,
      accessor,
      children,
      title
    }
  };
};

export const useModelFieldGroupIntegerSelect = (props) => {
  const inputProps = useModelFieldGroup(props);
  const { attribute } = inputProps;
  // Translate to html input prop naming from the OpenAPI naming
  const { minimum: min, maximum: max } = attribute;

  const children = useMemo(
    () =>
      Array.from({ length: max - min }, (x, i) => ({
        id: i + min,
        display_name: `${i + min}`
      })),
    [min, max]
  );

  const accessor = useCallback((value) => value || -1, []);
  const title = `${attribute.readableName}...`;

  return {
    ...inputProps,
    fieldGroupProps: {
      ...inputProps.fieldGroupProps,
      accessor,
      children,
      title
    }
  };
};

export const useModelDisplayFieldGroupAttachment = (props) => {
  const inputProps = useModelFieldGroup(props);

  const accessor = useCallback((value) => value?.url, []);
  const watch = useWatch({ name: props.path });

  const children = useMemo(
    () => props.children || watch?.display_name,
    [props.children, watch]
  );

  return {
    ...inputProps,
    fieldGroupProps: {
      ...inputProps.fieldGroupProps,
      accessor,
      children
    }
  };
};

export const useModelDisplayFieldGroupAttachmentImage = (props) => {
  const inputProps = useModelFieldGroup(props);

  const accessor = useCallback((value) => value?.url, []);
  const watch = useWatch({ name: props.path });

  const alt = useMemo(() => watch?.display_name, [watch]);

  return {
    ...inputProps,
    fieldGroupProps: {
      ...inputProps.fieldGroupProps,
      accessor,
      alt
    }
  };
};

export const useDefaultValues = (model, paths, options = {}) => {
  const schema = useSchema(model, paths, options);

  const defaultValues = useMemo(
    () => ({ ...schema.default(), ...options.extraDefaultValues }),
    [schema, options.extraDefaultValues]
  );

  return defaultValues;
};

export const useResolver = (schema) => {
  const resolver = useMemo(() => yupResolver(schema), [schema]);

  return resolver;
};

export const useFilterField = (path, operator) => {
  const operatorPath = useMemo(
    () => compact([path, operator]).join('.'),
    [path, operator]
  );

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
