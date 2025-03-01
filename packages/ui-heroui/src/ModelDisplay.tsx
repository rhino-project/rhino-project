import React from 'react';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import {
  DisplayAttachments,
  DisplayAttachmentsProps,
  DisplayArray,
  DisplayArrayProps,
  DisplayArrayReference,
  DisplayArrayReferenceProps,
  DisplayBoolean,
  DisplayBooleanProps,
  DisplayDate,
  DisplayDateTime,
  DisplayDateTimeProps,
  DisplayCurrencyProps,
  DisplayCurrency,
  DisplayEnum,
  DisplayEnumProps,
  DisplayFloat,
  DisplayFloatProps,
  DisplayInteger,
  DisplayIntegerProps,
  DisplayReference,
  DisplayReferenceProps,
  DisplayText,
  DisplayTextProps,
  DisplayTime,
  DisplayLink,
  DisplayLinkProps,
  DisplayImage,
  DisplayImageProps,
  DisplayString,
  DisplayStringProps,
  DisplayTimeProps,
  DisplayYear,
  DisplayYearProps
} from './Display';
import {
  useModelDisplayAttachmentImageProps,
  useModelDisplayInputProps,
  useModelDisplayDateTimeProps,
  useModelDisplayTimeProps,
  useModelDisplayBooleanProps,
  useModelDisplayAttachmentProps,
  useModelDisplayNumberInputProps
} from './form';
import { Resources } from '@rhino-project/core';

// Attachment
export const ModelDisplayAttachmentBase: React.FC<DisplayLinkProps> = (
  props
) => {
  const displayProps = useModelDisplayAttachmentProps(props);

  return <DisplayLink {...displayProps} />;
};

// Attachment Image
export const ModelDisplayAttachmentImageBase: React.FC<DisplayImageProps> = (
  props
) => {
  const displayProps = useModelDisplayAttachmentImageProps(props);

  return <DisplayImage {...displayProps} />;
};

// Attachments
export const ModelDisplayAttachmentsBase: React.FC<DisplayAttachmentsProps> = (
  props
) => {
  const displayProps = useModelDisplayInputProps(props);

  return <DisplayAttachments {...displayProps} />;
};

// Array
export const ModelDisplayArrayBase: React.FC<DisplayArrayProps> = (props) => {
  const displayProps = useModelDisplayInputProps(props);

  return <DisplayArray {...displayProps} />;
};

// Array Reference
export const ModelDisplayArrayReferenceBase: React.FC<
  DisplayArrayReferenceProps
> = (props) => {
  const displayProps = useModelDisplayInputProps(props);

  return <DisplayArrayReference {...displayProps} />;
};

// Boolean
export const ModelDisplayBooleanBase = <T extends keyof Resources>(
  props: DisplayBooleanProps & {
    path: keyof Resources[T];
  }
) => {
  const displayProps = useModelDisplayBooleanProps(props);

  return <DisplayBoolean {...displayProps} />;
};

// Currency
export const ModelDisplayCurrencyBase: React.FC<DisplayCurrencyProps> = (
  props
) => {
  const displayProps = useModelDisplayNumberInputProps(props);

  return <DisplayCurrency {...displayProps} />;
};

// Date and Time
export const ModelDisplayDateTimeBase: React.FC<DisplayDateTimeProps> = (
  props
) => {
  const displayProps = useModelDisplayDateTimeProps(props);

  return <DisplayDateTime {...displayProps} />;
};

// Date
export const ModelDisplayDateBase: React.FC<DisplayDateTimeProps> = (props) => {
  const displayProps = useModelDisplayDateTimeProps(props);

  return <DisplayDate {...displayProps} />;
};

// Enum
export const ModelDisplayEnumBase: React.FC<DisplayEnumProps> = (props) => {
  const displayProps = useModelDisplayInputProps(props);

  return <DisplayEnum {...displayProps} />;
};

// Float
export const ModelDisplayFloatBase: React.FC<DisplayFloatProps> = (props) => {
  const displayProps = useModelDisplayNumberInputProps(props);

  return <DisplayFloat {...displayProps} />;
};

// Integer
export const ModelDisplayIntegerBase: React.FC<DisplayIntegerProps> = (
  props
) => {
  const displayProps = useModelDisplayNumberInputProps(props);

  return <DisplayInteger {...displayProps} />;
};

// Reference
export const ModelDisplayReferenceBase: React.FC<DisplayReferenceProps> = (
  props
) => {
  const displayProps = useModelDisplayInputProps(props);

  return <DisplayReference {...displayProps} />;
};

// String
export const ModelDisplayStringBase: React.FC<DisplayStringProps> = (props) => {
  const displayProps = useModelDisplayInputProps(props);

  return <DisplayString {...displayProps} />;
};

// Text
export const ModelDisplayTextBase: React.FC<DisplayTextProps> = (props) => {
  const displayProps = useModelDisplayInputProps(props);

  return <DisplayText {...displayProps} />;
};

// Time
export const ModelDisplayTimeBase: React.FC<DisplayTimeProps> = (props) => {
  const displayProps = useModelDisplayTimeProps(props);

  return <DisplayTime {...displayProps} />;
};

// Year
export const ModelDisplayYearBase: React.FC<DisplayYearProps> = (props) => {
  const displayProps = useModelDisplayNumberInputProps(props);

  return <DisplayYear {...displayProps} />;
};

// Overrideable component exports
export const ModelDisplayAttachment: React.FC<DisplayLinkProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayAttachment',
    ModelDisplayAttachmentBase,
    props
  );

export const ModelDisplayAttachmentImage: React.FC<DisplayImageProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelDisplayAttachmentImage',
    ModelDisplayAttachmentImageBase,
    props
  );

export const ModelDisplayAttachments: React.FC<DisplayAttachmentsProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelDisplayAttachments',
    ModelDisplayAttachmentsBase,
    props
  );

export const ModelDisplayArray: React.FC<DisplayArrayProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayArray',
    ModelDisplayArrayBase,
    props
  );

export const ModelDisplayArrayReference: React.FC<
  DisplayArrayReferenceProps
> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayArrayReference',
    ModelDisplayArrayReferenceBase,
    props
  );

export const ModelDisplayBoolean: React.FC<DisplayBooleanProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayBoolean',
    ModelDisplayBooleanBase,
    props
  );

export const ModelDisplayCurrency: React.FC<DisplayCurrencyProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayCurrency',
    ModelDisplayCurrencyBase,
    props
  );

export const ModelDisplayDate: React.FC<DisplayDateTimeProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayDate',
    ModelDisplayDateBase,
    props
  );

export const ModelDisplayDateTime: React.FC<DisplayDateTimeProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayDateTime',
    ModelDisplayDateTimeBase,
    props
  );

export const ModelDisplayEnum: React.FC<DisplayEnumProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayEnum',
    ModelDisplayEnumBase,
    props
  );

export const ModelDisplayFloat: React.FC<DisplayFloatProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayFloat',
    ModelDisplayFloatBase,
    props
  );

export const ModelDisplayInteger: React.FC<DisplayIntegerProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayInteger',
    ModelDisplayIntegerBase,
    props
  );

export const ModelDisplayReference: React.FC<DisplayReferenceProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayReference',
    ModelDisplayReferenceBase,
    props
  );

export const ModelDisplayString: React.FC<DisplayStringProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayString',
    ModelDisplayStringBase,
    props
  );

export const ModelDisplayText: React.FC<DisplayTextProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayText',
    ModelDisplayTextBase,
    props
  );

export const ModelDisplayTime: React.FC<DisplayTimeProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayTime',
    ModelDisplayTimeBase,
    props
  );

export const ModelDisplayYear: React.FC<DisplayTimeProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayYear',
    ModelDisplayYearBase,
    props
  );
