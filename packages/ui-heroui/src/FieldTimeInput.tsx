import React, { useCallback, useMemo } from 'react';
import { TimeInputProps, TimeInput, TimeInputValue } from '@heroui/react';

import {
  FieldValues,
  Path,
  useController,
  UseControllerProps
} from 'react-hook-form';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { parseAbsoluteToLocal } from '@internationalized/date';

export type FieldTimeInputProps<T extends FieldValues = FieldValues> =
  TimeInputProps &
    Omit<UseControllerProps<T>, 'name' | 'control'> & {
      parse?: (value: string) => TimeInputValue | null | undefined;
      /**
       * The path inside the form object.
       */
      path: Path<T>;
    };

export const FieldTimeInputBase = <T extends FieldValues = FieldValues>({
  path,
  parse = parseAbsoluteToLocal,
  ...props
}: FieldTimeInputProps<T>) => {
  const {
    field: { onChange, disabled, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({ name: path });

  const value = useMemo(
    () => (fieldValue ? parse(fieldValue) : null),
    [fieldValue, parse]
  );

  const handleOnChange = useCallback(
    // Keep it in aboslute time throughout
    (value: TimeInputValue | null) => {
      onChange(
        value
          ? new Date(
              2000,
              1,
              1,
              value.hour,
              value.minute,
              value.second
            ).toISOString()
          : null
      );
    },
    [onChange]
  );

  return (
    <TimeInput
      {...fieldProps}
      granularity="second"
      errorMessage={error?.message}
      hideTimeZone
      isInvalid={!!error}
      isDisabled={disabled}
      onChange={handleOnChange}
      value={value}
      {...props}
    />
  );
};

export const FieldTimeInput = (props: FieldTimeInputProps) =>
  useGlobalComponent('FieldTimeInput', FieldTimeInputBase, props);
