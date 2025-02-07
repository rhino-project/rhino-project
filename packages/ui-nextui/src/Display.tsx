import React, { useCallback, useMemo } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { DisplayInput, DisplayInputProps } from './DisplayInput';
import { DisplayTextareaBase, DisplayTextareaProps } from './DisplayTextarea';
import {
  Checkbox,
  CheckboxProps,
  Image,
  ImageProps,
  Link,
  LinkProps
} from '@heroui/react';
import { useController } from 'react-hook-form';
import { applyCurrencyMask } from './utils';

// Types
export type DisplayAttachmentsProps = DisplayInputProps;
export type DisplayArrayProps = DisplayInputProps;
export type DisplayArrayReferenceProps = DisplayInputProps;
export type DisplayBooleanProps = CheckboxProps & {
  /**
   * The function to format the value before displaying it.
   */
  accessor?: (value: any) => string | null | undefined;
  /**
   * The path inside the form object.
   */
  path: string;
};
export type DisplayCurrencyProps = DisplayInputProps;
export type DisplayDateTimeProps = DisplayInputProps & {
  /**
   * The format to display
   */
  format?: string;
};
export type DisplayDateProps = DisplayDateTimeProps;
export type DisplayEnumProps = DisplayInputProps;
export type DisplayFloatProps = DisplayInputProps;
export type DisplayImageProps = ImageProps & {
  /**
   * The function to format the value before displaying it.
   */
  accessor?: (value: any) => string | null | undefined;
  /**
   * The path inside the form object.
   */
  path: string;
};
export type DisplayIntegerProps = DisplayFloatProps;
export type DisplayLinkProps = LinkProps & {
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
  path: string;
};
export type DisplayReferenceProps = DisplayInputProps;
export type DisplayStringProps = DisplayInputProps;
export type DisplayTimeProps = DisplayDateTimeProps;
export type DisplayTextProps = DisplayTextareaProps;

// Attachments
export const DisplayAttachmentsBase = React.forwardRef<
  HTMLInputElement,
  DisplayAttachmentsProps
>((props, ref) => {
  const accessor = useCallback(
    (value) => (value?.length ? `${value?.length} files` : undefined),
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
  const accessor = useCallback((value) => value?.map((v) => v)?.join(', '), []);

  return <DisplayInput ref={ref} accessor={accessor} {...props} />;
});
DisplayArrayBase.displayName = 'DisplayArrayBase';

// Array Reference
export const DisplayArrayReferenceBase = React.forwardRef<
  HTMLInputElement,
  DisplayArrayReferenceProps
>((props, ref) => {
  const accessor = useCallback(
    (value) => value?.map((v) => v.display_name)?.join(', '),
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
  } = useController({ name: path });

  const value = useMemo(() => {
    const accessedValue = accessor ? accessor(fieldValue) : fieldValue;

    if (typeof accessedValue === 'boolean') return accessedValue;
    if (typeof accessedValue !== 'string') return null;

    const normalized = accessedValue.trim().replace(/ /g, '').toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;

    return null;
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
    <DisplayInput
      ref={ref}
      accessor={applyCurrencyMask}
      startContent={
        <div className="pointer-events-none flex items-center">
          <span className="text-default-400 text-small">$</span>
        </div>
      }
      {...props}
    />
  );
});
DisplayCurrencyBase.displayName = 'DisplayCurrencyBase';

// Date and Time
export const DisplayDateTimeBase = React.forwardRef<
  HTMLInputElement,
  DisplayDateTimeProps
>(({ format = 'MMMM d, yyyy h:mm aa', ...props }, ref) => {
  const accessor = useCallback(
    (value) => {
      // Null will be handled by DisplayInput as empty
      if (!value) return null;

      return dateFormat(parseISO(value), format);
    },
    [format]
  );

  return <DisplayInput ref={ref} accessor={accessor} {...props} />;
});
DisplayDateTimeBase.displayName = 'DisplayDateTimeBase';

// Date
export const DisplayDateBase = (props: DisplayDateProps) => (
  <DisplayDateTimeBase format={'MMMM d, yyyy'} {...props} />
);

// Enum
export const DisplayEnumBase = (props: DisplayEnumProps) => (
  <DisplayInput {...props} />
);

// Float
export const DisplayFloatBase = React.forwardRef<
  HTMLInputElement,
  DisplayFloatProps
>((props, ref) => {
  const accessor = useCallback((value) => {
    // Null will be handled by DisplayInput as empty
    // Nullish coalescing operator will handle 0 as a valid value
    if (value == null) return null;

    return value;
  }, []);

  return <DisplayInput ref={ref} accessor={accessor} {...props} />;
});
DisplayFloatBase.displayName = 'DisplayFloatBase';

// Image
export const DisplayImageBase = React.forwardRef<
  HTMLImageElement,
  DisplayImageProps
>(({ accessor, children, empty, ...props }, ref) => {
  const { path } = props;
  const {
    field: { value: fieldValue }
  } = useController({ name: path });

  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue),
    [accessor, fieldValue]
  );

  return <Image ref={ref} src={value} {...props} />;
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
  } = useController({ name: path });

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
        <div ref={ref}>{empty}</div>
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
export const DisplayTextBase = (props: DisplayTextProps) => (
  <DisplayTextareaBase {...props} />
);

// Time
export const DisplayTimeBase = (props: DisplayTimeProps) => (
  <DisplayDateTimeBase format={'h:mm aa'} {...props} />
);

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
