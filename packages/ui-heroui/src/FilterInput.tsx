import { Input, InputProps } from '@heroui/react';

import {
  FieldValues,
  Path,
  useController,
  UseControllerProps,
  useFormContext
} from 'react-hook-form';
import React, { useCallback } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type FilterInputProps<T extends FieldValues = FieldValues> = InputProps &
  Omit<UseControllerProps<T>, 'name' | 'control'> & {
    /**
     * The path inside the form object.
     */
    path: Path<T>;
  };

export const FilterInputBase = <T extends FieldValues = FieldValues>({
  path,
  rules,
  shouldUnregister,
  defaultValue,
  disabled,
  ...props
}: FilterInputProps<T>) => {
  const {
    field: { onChange, value, ...fieldProps }
  } = useController({
    name: path,
    rules,
    shouldUnregister,
    defaultValue,
    disabled
  });
  const { resetField } = useFormContext();

  // FIXME: still needed?
  // const value = useMemo(
  //   () => (accessor ? accessor(fieldValue) : fieldValue),
  //   [accessor, fieldValue]
  // );

  // null is special and means no value (empty) for filtering
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      ({ target }) => onChange(target.value === '' ? null : target.value),
      [onChange]
    );

  return (
    <Input
      {...fieldProps}
      isClearable
      // Always keep it as a controlled component
      value={value == null ? '' : value}
      onChange={handleOnChange}
      onClear={() => resetField(path)}
      {...props}
    />
  );
};

export const FilterInput = (props: FilterInputProps) =>
  useGlobalComponent('FilterInput', FilterInputBase, props);
