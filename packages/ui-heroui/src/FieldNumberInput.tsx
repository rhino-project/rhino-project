import { useMemo } from 'react';
import { NumberInput, NumberInputProps } from '@heroui/react';
import {
  FieldValues,
  Path,
  useController,
  UseControllerProps
} from 'react-hook-form';

import { useGlobalComponent } from '@rhino-project/core/hooks';

export type FieldNumberInputProps<T extends FieldValues = FieldValues> =
  NumberInputProps &
    Omit<UseControllerProps<T>, 'name' | 'control'> & {
      /**
       * The function to format the value before displaying it.
       */
      accessor?: (value: unknown) => number | null | undefined;
      /**
       * The path inside the form object.
       */
      path: Path<T>;
    };

export const FieldNumberInputBase = <T extends FieldValues = FieldValues>({
  accessor,
  path,
  rules,
  shouldUnregister,
  defaultValue,
  disabled: propDisabled,
  ...props
}: FieldNumberInputProps<T>) => {
  const {
    field: { disabled, onChange, value: fieldValue, ...fieldProps },
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
    <NumberInput
      {...fieldProps}
      autoComplete="off"
      isInvalid={!!error}
      isDisabled={disabled}
      errorMessage={error?.message}
      value={value || NaN}
      onValueChange={(value) => onChange(value)}
      {...props}
    />
  );
};

export const FieldNumberInput = (props: FieldNumberInputProps) =>
  useGlobalComponent('FieldNumberInput', FieldNumberInputBase, props);
