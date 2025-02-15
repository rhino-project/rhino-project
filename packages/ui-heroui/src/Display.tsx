import React, { useCallback, useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { DisplayInput, DisplayInputProps } from './DisplayInput';
import { DisplayTextarea, DisplayTextareaProps } from './DisplayTextarea';
import {
  Checkbox,
  CheckboxProps,
  Image,
  ImageProps,
  Link,
  LinkProps
} from '@heroui/react';
import { useController } from 'react-hook-form';
import { FieldTimeInput } from './FieldTimeInput';
import { FieldTimeProps } from './Field';
import { FieldDatePicker, FieldDatePickerProps } from './FieldDatePicker';
import { parseDate } from '@internationalized/date';
import {
  DisplayNumberInput,
  DisplayNumberInputProps
} from './DisplayNumberInput';

// Types
export type DisplayAttachmentsProps = DisplayInputProps;
export type DisplayArrayProps = DisplayInputProps;
export type DisplayArrayReferenceProps = DisplayInputProps;
export type DisplayBooleanProps = CheckboxProps & {
  /**
   * The function to format the value before displaying it.
   */
  accessor?: (value: unknown) => boolean | null | undefined;
  /**
   * The path inside the form object.
   */
  path: string;
};
export type DisplayCurrencyProps = DisplayNumberInputProps;
export type DisplayDateTimeProps = FieldDatePickerProps;
export type DisplayDateProps = FieldDatePickerProps;
export type DisplayEnumProps = DisplayInputProps;
export type DisplayFloatProps = DisplayNumberInputProps;
export type DisplayImageProps = ImageProps & {
  /**
   * The function to format the value before displaying it.
   */
  accessor?: (value: unknown) => string | null | undefined;
  /**
   * The path inside the form object.
   */
  path: string;
};
export type DisplayIntegerProps = DisplayNumberInputProps;
export type DisplayLinkProps = LinkProps & {
  /**
   * The function to format the value before displaying it.
   */
  accessor?: (value: string | null | undefined) => string | null | undefined;
  /**
   * The path inside the form object.
   */
  path: string;
  /**
   * Content to display when value is empty
   */
  empty?: React.ReactNode;
};
export type DisplayReferenceProps = DisplayInputProps;
export type DisplayStringProps = DisplayInputProps;
export type DisplayTextProps = DisplayTextareaProps;
export type DisplayTimeProps = FieldTimeProps;
export type DisplayYearProps = DisplayNumberInputProps;

// Attachments
export const DisplayAttachmentsBase = React.forwardRef<
  HTMLInputElement,
  DisplayAttachmentsProps
>((props, ref) => {
  const accessor = useCallback(
    (value: unknown) =>
      Array.isArray(value) && value.length
        ? `${value.length} files`
        : undefined,
    []
  );

  return <DisplayInput ref={ref} accessor={accessor} {...props} />;
});
DisplayAttachmentsBase.displayName = 'DisplayAttachmentsBase';

// Array
export const DisplayArrayBase = React.forwardRef<
  HTMLInputElement,
  DisplayArrayProps
>((props, ref) => {
  const accessor = useCallback(
    (value: unknown) =>
      Array.isArray(value)
        ? value.map((v) => String(v))?.join(', ')
        : undefined,
    []
  );

  return <DisplayInput ref={ref} accessor={accessor} {...props} />;
});
DisplayArrayBase.displayName = 'DisplayArrayBase';

// Array Reference
export const DisplayArrayReferenceBase = React.forwardRef<
  HTMLInputElement,
  DisplayArrayReferenceProps
>((props, ref) => {
  const accessor = useCallback(
    (value: unknown) =>
      Array.isArray(value)
        ? value.map((v: { display_name: string }) => v.display_name)?.join(', ')
        : undefined,
    []
  );

  return <DisplayInput ref={ref} accessor={accessor} {...props} />;
});
DisplayArrayReferenceBase.displayName = 'DisplayArrayReferenceBase';

// Boolean
export const DisplayBooleanBase = React.forwardRef<
  HTMLInputElement,
  DisplayBooleanProps
>(({ accessor, path, ...props }, ref) => {
  const {
    field: { value: fieldValue }
  } = useController<{ [key: string]: boolean | string | null | undefined }>({
    name: path
  });

  const value = useMemo((): boolean | null => {
    const accessedValue = accessor ? accessor(fieldValue) : fieldValue;

    if (typeof accessedValue === 'boolean') return accessedValue;
    if (typeof accessedValue !== 'string') return null;

    const normalized = accessedValue.toLowerCase().trim();
    return normalized === 'true' ? true : normalized === 'false' ? false : null;
  }, [accessor, fieldValue]);

  return (
    <Checkbox
      ref={ref}
      isIndeterminate={value == null}
      isSelected={value || false}
      {...props}
    />
  );
});
DisplayBooleanBase.displayName = 'DisplayBooleanBase';

// Currency
export const DisplayCurrencyBase = React.forwardRef<
  HTMLInputElement,
  DisplayCurrencyProps
>((props, ref) => {
  return (
    <DisplayNumberInput
      ref={ref}
      formatOptions={{
        style: 'currency',
        currency: 'USD'
      }}
      {...props}
    />
  );
});
DisplayCurrencyBase.displayName = 'DisplayCurrencyBase';

// Date and Time
export const DisplayDateTimeBase = React.forwardRef<
  HTMLInputElement,
  DisplayDateTimeProps
>((props, ref) => {
  return (
    <FieldDatePicker ref={ref} isReadOnly granularity="second" {...props} />
  );
});
DisplayDateTimeBase.displayName = 'DisplayDateTimeBase';

// Date
export const DisplayDateBase = (props: DisplayDateProps) => (
  <FieldDatePicker isReadOnly granularity="day" parse={parseDate} {...props} />
);

// Enum
export const DisplayEnumBase = (props: DisplayEnumProps) => (
  <DisplayInput {...props} />
);

// Float
export const DisplayFloatBase = React.forwardRef<
  HTMLInputElement,
  DisplayFloatProps
>((props, ref) => <DisplayNumberInput ref={ref} {...props} />);
DisplayFloatBase.displayName = 'DisplayFloatBase';

// Image
export const DisplayImageBase = React.forwardRef<
  HTMLImageElement,
  DisplayImageProps
>(({ accessor, ...props }, ref) => {
  const { path } = props;
  const {
    field: { value: fieldValue }
  } = useController<{ [key: string]: unknown }>({
    name: path
  });

  const value = useMemo(
    () =>
      accessor
        ? accessor(fieldValue)
        : (fieldValue as string | null | undefined),
    [accessor, fieldValue]
  );

  return <Image ref={ref} src={value ?? undefined} {...props} />;
});
DisplayImageBase.displayName = 'DisplayImageBase';

// Integer
export const DisplayIntegerBase = (props: DisplayIntegerProps) => (
  <DisplayFloatBase {...props} />
);

// Link
export const DisplayLinkBase = React.forwardRef<
  HTMLAnchorElement,
  DisplayLinkProps
>(({ accessor, children, empty, ...props }, ref) => {
  const { path } = props;
  const {
    field: { value: fieldValue }
  } = useController<{ [key: string]: string | null | undefined }>({
    name: path
  });

  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue),
    [accessor, fieldValue]
  );

  return (
    <>
      {value ? (
        <Link ref={ref} href={value} showAnchorIcon isExternal {...props}>
          {children || value}
        </Link>
      ) : (
        <div>{empty}</div>
      )}
    </>
  );
});
DisplayLinkBase.displayName = 'DisplayLinkBase';

// Reference
export const DisplayReferenceBase = React.forwardRef<
  HTMLInputElement,
  DisplayReferenceProps
>((props, ref) => {
  const accessor = useCallback(
    (value: unknown) => (value as { display_name?: string })?.display_name,
    []
  );

  return <DisplayInput ref={ref} accessor={accessor} {...props} />;
});
DisplayReferenceBase.displayName = 'DisplayReferenceBase';

// String
export const DisplayStringBase = React.forwardRef<
  HTMLInputElement,
  DisplayStringProps
>((props, ref) => {
  return <DisplayInput ref={ref} {...props} />;
});
DisplayStringBase.displayName = 'DisplayStringBase';

// Text
export const DisplayTextBase = React.forwardRef<
  HTMLTextAreaElement,
  DisplayTextProps
>((props, ref) => {
  return <DisplayTextarea ref={ref} {...props} />;
});
DisplayTextBase.displayName = 'DisplayTextBase';

// Time
export const DisplayTimeBase = React.forwardRef<
  HTMLInputElement,
  DisplayTimeProps
>((props, ref) => {
  return <FieldTimeInput ref={ref} isReadOnly {...props} />;
});
DisplayTimeBase.displayName = 'DisplayTimeBase';

// Year
export const DisplayYearBase = React.forwardRef<
  HTMLInputElement,
  DisplayYearProps
>((props, ref) => {
  return (
    <DisplayNumberInput
      ref={ref}
      formatOptions={{
        maximumFractionDigits: 0,
        useGrouping: false
      }}
      {...props}
    />
  );
});
DisplayYearBase.displayName = 'DisplayYearBase';

// Overrideable component exports
export const DisplayAttachments = (props: DisplayAttachmentsProps) =>
  useGlobalComponent('DisplayAttachments', DisplayAttachmentsBase, props);

export const DisplayArrayReference = (props: DisplayArrayReferenceProps) =>
  useGlobalComponent('DisplayArrayReference', DisplayArrayReferenceBase, props);

export const DisplayArray = (props: DisplayArrayProps) =>
  useGlobalComponent('DisplayArray', DisplayArrayBase, props);

export const DisplayBoolean = (props: DisplayBooleanProps) =>
  useGlobalComponent('DisplayBoolean', DisplayBooleanBase, props);

export const DisplayCurrency = (props: DisplayCurrencyProps) =>
  useGlobalComponent('DisplayCurrency', DisplayCurrencyBase, props);

export const DisplayDateTime = (props: DisplayDateTimeProps) =>
  useGlobalComponent('DisplayDateTime', DisplayDateTimeBase, props);

export const DisplayDate = (props: DisplayDateProps) =>
  useGlobalComponent('DisplayDate', DisplayDateBase, props);

export const DisplayEnum = (props: DisplayEnumProps) =>
  useGlobalComponent('DisplayEnum', DisplayEnumBase, props);

export const DisplayFloat = (props: DisplayFloatProps) =>
  useGlobalComponent('DisplayFloat', DisplayFloatBase, props);

export const DisplayImage = (props: DisplayImageProps) =>
  useGlobalComponent('DisplayImage', DisplayImageBase, props);

export const DisplayInteger = (props: DisplayIntegerProps) =>
  useGlobalComponent('DisplayInteger', DisplayIntegerBase, props);

export const DisplayLink = (props: DisplayLinkProps) =>
  useGlobalComponent('DisplayLink', DisplayLinkBase, props);

export const DisplayReference = (props: DisplayReferenceProps) =>
  useGlobalComponent('DisplayReference', DisplayReferenceBase, props);

export const DisplayString = (props: DisplayStringProps) =>
  useGlobalComponent('DisplayString', DisplayStringBase, props);

export const DisplayText = (props: DisplayTextProps) =>
  useGlobalComponent('DisplayText', DisplayTextBase, props);

export const DisplayTime = (props: DisplayTimeProps) =>
  useGlobalComponent('DisplayTime', DisplayTimeBase, props);

export const DisplayYear = (props: DisplayYearProps) =>
  useGlobalComponent('DisplayYear', DisplayYearBase, props);
