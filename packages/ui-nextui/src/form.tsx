import { SelectItem } from '@heroui/react';
import {
  useModel,
  useModelAndAttributeFromPath
} from '@rhino-project/core/hooks';
import { getModelAndAttributeFromPath } from '@rhino-project/core/utils';
import { compact } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

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
    label,
    isClearable: attribute.nullable,
    placeholder,
    isRequired: !!attribute['x-rhino-required'],
    ...props
  };
};

export const useModelFieldGroupEnum = ({
  children: propsChildren,
  ...props
}) => {
  const inputProps = useModelFieldGroup(props);
  const { attribute } = inputProps;

  const label = useMemo(
    () => props?.label || attribute.readableName,
    [attribute, props?.label]
  );

  const children = useMemo(() => {
    // children can be a single element or an array
    if (propsChildren)
      return Array.isArray(propsChildren) ? propsChildren : [propsChildren];

    // FIXME: key not value might be needed here
    return attribute.enum.map((e) => (
      <SelectItem key={e} className="capitalize" textValue={e}>
        {e}
      </SelectItem>
    ));
  }, [attribute.enum, propsChildren]);

  const accessor = useCallback((value) => value || -1, []);

  return {
    ...inputProps,
    fieldGroupProps: {
      ...inputProps.fieldGroupProps,
      accessor,
      children,
      label
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
      Array.from({ length: max - min }, (x, i) => (
        <SelectItem key={i + min} textValue={`${i + min}`}>
          {i + min}
        </SelectItem>
      )),
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

export const useModelDisplayGroup = (props) => {
  const { isClearable, ...readOnlyProps } = useModelFieldGroup(props);

  return readOnlyProps;
};

export const useModelDisplay = ({ model, ...props }) => {
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
    label,
    placeholder,
    isRequired: !!attribute['x-rhino-required'],
    ...props
  };
};

export const useModelDisplayAttachment = (props) => {
  const inputProps = useModelFieldGroup(props);

  const accessor = useCallback((value) => value?.url, []);
  const watch = useWatch({ name: props.path });

  const children = useMemo(
    () => props.children || watch?.display_name,
    [props.children, watch]
  );

  return {
    ...inputProps,
    accessor,
    children
  };
};

export const useModelDisplayAttachmentImage = (props) => {
  const inputProps = useModelDisplayGroup(props);

  const accessor = useCallback((value) => value?.url, []);
  const watch = useWatch({ name: props.path });

  const alt = useMemo(() => watch?.display_name, [watch]);

  return {
    ...inputProps,
    accessor,
    alt
  };
};

export const useModelFilterGroup = (props) => {
  const { isClearable, isRequired, ...readOnlyProps } =
    useModelFieldGroup(props);

  return readOnlyProps;
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

  const label = useMemo(
    () => options?.label || attribute.readableName,
    [attribute, options?.label]
  );

  // FIXME: Memoize this?
  return {
    attribute,
    attributeModel,
    label,
    labelPlacement: 'inside',
    operator,
    plainPath,
    ...filterField
  };
};
