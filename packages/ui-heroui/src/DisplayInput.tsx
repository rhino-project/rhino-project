import { Input, InputProps } from '@heroui/react';
import {
  useController,
  UseControllerProps,
  FieldValues,
  Path
} from 'react-hook-form';
import { useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type DisplayInputProps<T extends FieldValues = FieldValues> =
  InputProps &
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

export const DisplayInputBase = <T extends FieldValues = FieldValues>({
  accessor,
  empty = '-',
  path,
  rules,
  shouldUnregister,
  defaultValue,
  disabled,
  ...props
}: DisplayInputProps<T>) => {
  const {
    field: { value: fieldValue, ...fieldProps }
  } = useController<T>({
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
    <Input
      {...fieldProps}
      isReadOnly
      autoComplete="off"
      value={value}
      {...props}
    />
  );
};

export const DisplayInput = <T extends FieldValues = FieldValues>(
  props: DisplayInputProps<T>
) => useGlobalComponent('DisplayInput', DisplayInputBase, props);
