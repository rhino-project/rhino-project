import React, { useCallback, useMemo } from 'react';
import { DatePicker, DatePickerProps } from '@heroui/react';

import { useController, RegisterOptions } from 'react-hook-form';
import { useFieldInheritedProps } from '@rhino-project/core/hooks';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal
} from '@internationalized/date';

export type FieldDatePickerProps = DatePickerProps &
  RegisterOptions & {
    parse?: (
      value: string
    ) => ZonedDateTime | CalendarDate | CalendarDateTime | null | undefined;
    /**
     * The path inside the form object.
     */
    path: string;
  };

export const FieldDatePickerBase: React.FC<FieldDatePickerProps> = ({
  path,
  parse = parseAbsoluteToLocal,
  ...props
}) => {
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const {
    field: { onChange, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({ name: path });

  // The placeholder value controls the format of the return value when its updated
  // as well as the default date shown in the picker when the value is empty.
  const placeholderValue = useMemo(() => {
    if (extractedProps.placeholderValue) return extractedProps.placeholderValue;

    const date = now(getLocalTimeZone());

    return date.set({ millisecond: 0 });
  }, []);

  const value = useMemo(
    () => (fieldValue ? parse(fieldValue) : null),
    [fieldValue, parse]
  );

  const handleOnChange = useCallback(
    // https://github.com/adobe/react-spectrum/issues/3953#issuecomment-1402914920
    (newValue) => {
      let stringValue = undefined;

      try {
        stringValue = newValue.toAbsoluteString();
      } catch (err) {
        try {
          stringValue = newValue.toString();
        } catch (err) {
          stringValue = null;
        }
      }

      onChange(stringValue);
    },
    [onChange]
  );

  return (
    <DatePicker
      {...extractedProps}
      {...fieldProps}
      granularity="second"
      placeholderValue={placeholderValue}
      errorMessage={error?.message}
      hideTimeZone
      isInvalid={!!error}
      onChange={handleOnChange}
      selectorButtonPlacement="start"
      showMonthAndYearPickers
      value={value}
      {...inheritedProps}
    />
  );
};

export const FieldDatePicker = (props: FieldDatePickerProps) =>
  useGlobalComponent('FieldDatePicker', FieldDatePickerBase, props);
