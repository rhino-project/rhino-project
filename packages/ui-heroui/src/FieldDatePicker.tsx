import React, { useCallback, useMemo } from 'react';
import { DatePicker, DatePickerProps } from '@heroui/react';

import {
  FieldValues,
  Path,
  useController,
  UseControllerProps
} from 'react-hook-form';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  getLocalTimeZone,
  now,
  parseAbsoluteToLocal
} from '@internationalized/date';

export type FieldDatePickerProps<T extends FieldValues = FieldValues> =
  DatePickerProps &
    Omit<UseControllerProps<T>, 'name' | 'control'> & {
      parse?: (
        value: string
      ) => ZonedDateTime | CalendarDate | CalendarDateTime | null | undefined;
      /**
       * The path inside the form object.
       */
      path: Path<T>;
    };

export const FieldDatePickerBase = <T extends FieldValues = FieldValues>({
  path,
  parse = parseAbsoluteToLocal,
  ...props
}: FieldDatePickerProps<T>) => {
  const {
    field: { onChange, disabled, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({ name: path });

  // The placeholder value controls the format of the return value when its updated
  // as well as the default date shown in the picker when the value is empty.
  const placeholderValue = useMemo(() => {
    if (props.placeholderValue) return props.placeholderValue;

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
      {...fieldProps}
      granularity="second"
      placeholderValue={placeholderValue}
      errorMessage={error?.message}
      hideTimeZone
      isInvalid={!!error}
      isDisabled={disabled}
      onChange={handleOnChange}
      selectorButtonPlacement="start"
      showMonthAndYearPickers
      value={value}
      {...props}
    />
  );
};

export const FieldDatePicker = (props: FieldDatePickerProps) =>
  useGlobalComponent('FieldDatePicker', FieldDatePickerBase, props);
