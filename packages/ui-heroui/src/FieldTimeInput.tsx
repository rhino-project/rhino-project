import React, { useCallback, useMemo } from 'react';
import { TimeInputProps, TimeInput } from '@heroui/react';

import { useController, RegisterOptions } from 'react-hook-form';
import { useFieldInheritedProps } from '@rhino-project/core/hooks';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { parseAbsoluteToLocal } from '@internationalized/date';

export type FieldTimeInputProps = TimeInputProps &
  RegisterOptions & {
    parse?: (value: string) => unknown | null;
    /**
     * The path inside the form object.
     */
    path: string;
  };

export const FieldTimeInputBase: React.FC<FieldTimeInputProps> = ({
  path,
  parse = parseAbsoluteToLocal,
  ...props
}) => {
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const {
    field: { onChange, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({ name: path });

  const value = useMemo(
    () => (fieldValue ? parse(fieldValue) : null),
    [fieldValue, parse]
  );

  const handleOnChange = useCallback(
    // Keep it in aboslute time throughout
    (value) => {
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
      {...extractedProps}
      {...fieldProps}
      granularity="second"
      errorMessage={error?.message}
      hideTimeZone
      isInvalid={!!error}
      onChange={handleOnChange}
      value={value}
      {...inheritedProps}
    />
  );
};

export const FieldTimeInput = (props: FieldTimeInputProps) =>
  useGlobalComponent('FieldTimeInput', FieldTimeInputBase, props);
