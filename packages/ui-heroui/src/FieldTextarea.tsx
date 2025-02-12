import React, { useMemo } from 'react';
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
      accessor?: (value: unknown) => string | undefined;
      /**
       * The path inside the form object.
       */
      path: Path<T>;
    };

export const FieldTextareaBase = <T extends FieldValues = FieldValues>({
  accessor,
  ...props
}: FieldTextareaProps<T>) => {
  const { path } = props;
  const {
    field: { disabled, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue),
    [accessor, fieldValue]
  );

  return (
    <Textarea
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

export const FieldTextarea = (props: FieldTextareaProps) =>
  useGlobalComponent('FieldTextarea', FieldTextareaBase, props);
