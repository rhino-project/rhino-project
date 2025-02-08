import React from 'react';
import { SelectItem } from '@heroui/react';
import {
  useModel,
  useModelAndAttributeFromPath,
  useModelContext
} from '@rhino-project/core/hooks';
import { getModelAndAttributeFromPath } from '@rhino-project/core/utils';
import { compact } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  DisplayBooleanProps,
  DisplayDateTimeProps,
  DisplayImageProps,
  DisplayLinkProps,
  DisplayTimeProps
} from './Display';
import { DisplayInputProps } from './DisplayInput';
import { DisplayTextareaProps } from './DisplayTextarea';
import { FieldInputProps } from './FieldInput';
import { FieldTextareaProps } from './FieldTextarea';
import { FieldBooleanProps, FieldDateTimeProps, FieldTimeProps } from './Field';
import { FieldDatePickerProps } from './FieldDatePicker';
import { FieldSelectProps } from './FieldSelect';

export const useModelFieldLabel = ({ path }: { path: string }) => {
  const { model } = useModelContext() as { model: Record<string, unknown> };
  const { attribute } = useModelAndAttributeFromPath(model, path) as {
    attribute: { readableName: string };
  };

  return attribute.readableName;
};

export const useModelFieldClearable = ({ path }: { path: string }) => {
  const { model } = useModelContext() as { model: Record<string, unknown> };
  const { attribute } = useModelAndAttributeFromPath(model, path) as {
    attribute: { nullable: string | undefined };
  };

  return !!attribute.nullable;
};

export const useModelFieldRequired = ({ path }: { path: string }) => {
  const { model } = useModelContext() as { model: Record<string, unknown> };
  const { attribute } = useModelAndAttributeFromPath(model, path) as {
    attribute: { 'x-rhino-required': string | undefined };
  };

  return !!attribute['x-rhino-required'];
};

export const useModelFieldInputProps = <
  T extends FieldInputProps | FieldTextareaProps
>(
  props: T
): T => {
  const { path } = props;
  const { setValue } = useFormContext();
  const label = useModelFieldLabel(props);
  const isClearable = useModelFieldClearable(props);
  const isRequired = useModelFieldRequired(props);
  const onClear = useCallback(() => setValue(path, null), [setValue]);

  return { label, isClearable, isRequired, onClear, ...props };
};

export const useModelFieldBooleanProps = <T extends FieldBooleanProps>(
  props: T
): T => {
  const children = useModelFieldLabel(props);
  const isRequired = useModelFieldRequired(props);

  return { children, isRequired, ...props };
};

export const useModelFieldDateTimeProps = <T extends FieldDatePickerProps>(
  props: T
): T => {
  const label = useModelFieldLabel(props);
  const isRequired = useModelFieldRequired(props);

  return { label, isRequired, ...props };
};

export const useModelFieldEnumProps = ({
  children: propsChildren,
  ...props
}: FieldSelectProps): FieldSelectProps => {
  const { path } = props;
  const label = useModelFieldLabel(props);
  const isRequired = useModelFieldRequired(props);
  const { model } = useModelContext() as { model: Record<string, unknown> };
  const { attribute } = useModelAndAttributeFromPath(model, path) as {
    attribute: { enum: string[] };
  };

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

  const accessor = useCallback((value: unknown) => value || -1, []);

  return { accessor, children, label, isRequired, ...props };
};

export const useModelFieldTimeProps = <T extends FieldTimeProps>(
  props: T
): T => {
  const label = useModelFieldLabel(props);
  const isRequired = useModelFieldRequired(props);

  return { label, isRequired, ...props };
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

export const useModelDisplayLabel = ({ path }: { path: string }) => {
  const { model } = useModelContext() as { model: Record<string, unknown> };
  const { attribute } = useModelAndAttributeFromPath(model, path) as {
    attribute: { readableName: string };
  };

  return attribute.readableName;
};

export const useModelDisplayInputProps = <
  T extends DisplayInputProps | DisplayTextareaProps
>(
  props: T
): T => {
  const { path } = props;
  const label = useModelDisplayLabel({ path });

  return { label, ...props };
};

export const useModelDisplayBooleanProps = <T extends DisplayBooleanProps>(
  props: T
): T => {
  const { path } = props;
  const children = useModelDisplayLabel({ path });

  return { children, ...props };
};

export const useModelDisplayDateTimeProps = <T extends DisplayDateTimeProps>(
  props: T
): T => {
  const { path } = props;
  const label = useModelDisplayLabel({ path });

  return { label, ...props };
};

export const useModelDisplayTimeProps = <T extends DisplayTimeProps>(
  props: T
): T => {
  const { path } = props;
  const label = useModelDisplayLabel({ path });

  return { label, ...props };
};

export const useModelDisplayAttachmentProps = (
  props: DisplayLinkProps
): DisplayLinkProps => {
  const accessor = useCallback((value: unknown): string | null | undefined => {
    const typedValue = value as { url?: string } | null | undefined;
    return typedValue?.url;
  }, []);

  return {
    accessor,
    ...props
  };
};

export const useModelDisplayAttachmentImageProps = (
  props: DisplayImageProps
): DisplayImageProps => {
  const { path } = props;

  const accessor = useCallback((value: unknown): string | null | undefined => {
    const typedValue = value as { url?: string } | null | undefined;
    return typedValue?.url;
  }, []);
  const watch = useWatch<{
    [key: string]: { display_name?: string; url?: string };
  }>({ name: path });

  return {
    accessor,
    alt: watch?.display_name,
    ...props
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

const isDateRelated = (format) => ['date', 'time', 'datetime'].includes(format);

const operatorToDateLabel = (operator) => {
  switch (operator) {
    case 'diff':
      return 'not';
    case 'gt':
    case 'gteq':
      return 'after';
    case 'lt':
    case 'lteq':
      return 'before';
    default:
      return '';
  }
};

const operatorToLabel = (format, operator) => {
  if (isDateRelated(format)) return operatorToDateLabel(operator);

  switch (operator) {
    case 'diff':
    case 'gt':
      return '>';
    case 'gteq':
      return '>=';
    case 'lt':
      return '<';
    case 'lteq':
      return '<=';
    default:
      return '';
  }
};

export const useModelFilterField = (model, path, options = {}) => {
  const memoModel = useModel(model);

  const [attributeModel, attribute, operator, plainPath] = useMemo(
    () => getModelAndAttributeFromPath(memoModel, path),
    [memoModel, path]
  );

  const filterField = useFilterField(plainPath, operator, options);

  const label = useMemo(() => {
    if (options?.label) return options.label;

    const operatorLabel = operatorToLabel(attribute.format, operator);

    if (operatorLabel) return `${attribute.readableName} ${operatorLabel}`;

    return attribute.readableName;
  }, [attribute.format, attribute.readableName, operator, options?.label]);

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
