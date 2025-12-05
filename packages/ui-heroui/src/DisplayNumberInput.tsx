import { NumberInput, NumberInputProps } from '@heroui/react';
import {
  useController,
  UseControllerProps,
  FieldValues,
  Path
} from 'react-hook-form';
import { useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type DisplayNumberInputProps<T extends FieldValues = FieldValues> =
  NumberInputProps &
    Omit<UseControllerProps<T>, 'name' | 'control'> & {
      /**
       * The function to format the value before displaying it.
       */
      accessor?: (value: unknown) => number | null | undefined;
      /**
       * The string to display when the value is empty.
       */
      empty?: string;
      /**
       * The path inside the form object.
       */
      path: Path<T>;
    };

export const DisplayNumberInputBase = <T extends FieldValues = FieldValues>({
  accessor,
  path,
  rules,
  shouldUnregister,
  defaultValue,
  disabled,
  ...props
}: DisplayNumberInputProps<T>) => {
  const {
    field: { onChange, value: fieldValue, ...fieldProps }
  } = useController<T>({
    name: path,
    rules,
    shouldUnregister,
    defaultValue,
    disabled
  });

  // Nullish coalesing to avoid '0' being displayed as empty
  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue) ?? NaN,
    [accessor, fieldValue]
  );

  return (
    <NumberInput
      {...fieldProps}
      isReadOnly
      autoComplete="off"
      value={value}
      onValueChange={(value) => onChange(value)}
      {...props}
    />
  );
};

export const DisplayNumberInput = <T extends FieldValues = FieldValues>(
  props: DisplayNumberInputProps<T>
) => useGlobalComponent('DisplayNumberInput', DisplayNumberInputBase, props);
