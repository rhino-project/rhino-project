import { Textarea, TextAreaProps } from '@heroui/react';

import {
  useController,
  UseControllerProps,
  FieldValues,
  Path
} from 'react-hook-form';
import React, { useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type DisplayTextareaProps<T extends FieldValues = FieldValues> =
  TextAreaProps &
    Omit<UseControllerProps<T>, 'name' | 'control'> & {
      /**
       * The function to format the value before displaying it.
       */
      accessor?: (value: unknown) => string | null | undefined;
      /**
       * The string to display when the value is empty.
       */
      empty?: string;
      /**
       * The path inside the form object.
       */
      path: Path<T>;
    };

export const DisplayTextareaBase = <T extends FieldValues = FieldValues>({
  accessor,
  empty = '-',
  path,
  rules,
  shouldUnregister,
  defaultValue,
  disabled,
  ...props
}: DisplayTextareaProps<T>) => {
  const {
    field: { value: fieldValue, ...fieldProps }
  } = useController({
    name: path,
    rules,
    shouldUnregister,
    defaultValue,
    disabled
  });

  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue) ?? empty,
    [accessor, fieldValue, empty]
  );

  return (
    <Textarea
      {...fieldProps}
      isReadOnly
      autoComplete="off"
      value={value}
      {...props}
    />
  );
};

export const DisplayTextarea = <T extends FieldValues = FieldValues>(
  props: DisplayTextareaProps<T>
) => useGlobalComponent('DisplayTextarea', DisplayTextareaBase, props);
