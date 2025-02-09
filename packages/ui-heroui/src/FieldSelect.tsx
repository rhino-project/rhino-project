import React, { useCallback, useMemo } from 'react';
import { Select, SelectProps } from '@heroui/react';
import {
  FieldValues,
  Path,
  useController,
  UseControllerProps
} from 'react-hook-form';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type FieldSelectProps<T extends FieldValues = FieldValues> =
  SelectProps &
    Omit<UseControllerProps<T>, 'name' | 'control'> & {
      /**
       * The path inside the form object.
       */
      path: Path<T>;
    };

export const FieldSelectBase = <T extends FieldValues = FieldValues>({
  accessor,
  children,
  onChangeAccessor,
  ...props
}: FieldSelectProps<T>) => {
  const { path } = props;
  const {
    field: { onChange, disabled, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue),
    [accessor, fieldValue]
  );

  const handleOnChange = useCallback(
    ({ target }) => {
      const valueChanged = onChangeAccessor
        ? onChangeAccessor(target.value)
        : target.value === ''
          ? null
          : target.value;
      onChange(valueChanged);
    },
    [onChange, onChangeAccessor]
  );

  return (
    <Select
      {...fieldProps}
      isInvalid={!!error}
      isDisabled={disabled}
      errorMessage={error?.message}
      onChange={handleOnChange}
      selectedKeys={value ? [value] : []}
      {...props}
    >
      {children}
    </Select>
  );
};

export const FieldSelect = (props: FieldSelectProps) =>
  useGlobalComponent('FieldSelect', FieldSelectBase, props);
