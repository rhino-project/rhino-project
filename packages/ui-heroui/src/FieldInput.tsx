import React, { useMemo } from 'react';
import { Input, InputProps } from '@heroui/react';
import {
  FieldValues,
  Path,
  useController,
  UseControllerProps
} from 'react-hook-form';

import { useGlobalComponent } from '@rhino-project/core/hooks';

export type FieldInputProps<T extends FieldValues = FieldValues> = InputProps &
  Omit<UseControllerProps<T>, 'name' | 'control'> & {
    /**
     * The function to format the value before displaying it.
     */
    accessor?: (value: unknown) => string | null | undefined;
    /**
     * The path inside the form object.
     */
    path: Path<T>;
  };

export const FieldInputBase = <T extends FieldValues = FieldValues>({
  accessor,

  path,
  rules,
  shouldUnregister,
  defaultValue,
  disabled: propDisabled,
  ...props
}: FieldInputProps<T>) => {
  const {
    field: { disabled, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path,
    rules,
    shouldUnregister,
    defaultValue,
    disabled: propDisabled
  });

  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue),
    [accessor, fieldValue]
  );

  return (
    <Input
      {...fieldProps}
      autoComplete="off"
      isInvalid={!!error}
      isDisabled={disabled}
      errorMessage={error?.message}
      value={value || ''}
      {...props}
    />
  );
};

export const FieldInput = (props: FieldInputProps) =>
  useGlobalComponent('FieldInput', FieldInputBase, props);
