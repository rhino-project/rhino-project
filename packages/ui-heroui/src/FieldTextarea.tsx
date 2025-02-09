import React, { useCallback, useMemo } from 'react';
import { Textarea, TextAreaProps } from '@heroui/react';
import {
  FieldValues,
  Path,
  useController,
  UseControllerProps
} from 'react-hook-form';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type FieldTextareaProps<T extends FieldValues = FieldValues> =
  TextAreaProps &
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

export const FieldTextareaBase = <T extends FieldValues = FieldValues>({
  accessor,
  onChangeAccessor,
  ...props
}: FieldTextareaProps<T>) => {
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
        : target.value;
      onChange(valueChanged);
    },
    [onChange, onChangeAccessor]
  );

  return (
    <Textarea
      {...fieldProps}
      autoComplete="off"
      isInvalid={!!error}
      isDisabled={disabled}
      errorMessage={error?.message}
      onChange={handleOnChange}
      value={value}
      {...props}
    />
  );
};

export const FieldTextarea = (props: FieldTextareaProps) =>
  useGlobalComponent('FieldTextarea', FieldTextareaBase, props);
