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
  DisplayStringProps
} from './Display';
import { useModelDisplayAttachment, useModelDisplayGroup } from './form';

// Types
export type ModelDisplayProps = {
  model: string | Record<string, any>;
  attribute: string;
};

export type ModelDisplayAttachmentProps = DisplayLinkProps & ModelDisplayProps;
export type ModelDisplayAttachmentImageProps = DisplayImageProps &
  ModelDisplayProps;
export type ModelDisplayAttachmentsProps = DisplayAttachmentsProps &
  ModelDisplayProps;
export type ModelDisplayArrayProps = DisplayArrayProps & ModelDisplayProps;
export type ModelDisplayArrayReferenceProps = DisplayArrayReferenceProps &
  ModelDisplayProps;
export type ModelDisplayBooleanProps = DisplayBooleanProps & ModelDisplayProps;
export type ModelDisplayCurrencyProps = DisplayCurrencyProps &
  ModelDisplayProps;
export type ModelDisplayDateTimeProps = DisplayDateTimeProps &
  ModelDisplayProps;
export type ModelDisplayDateProps = ModelDisplayDateTimeProps;
export type ModelDisplayEnumProps = DisplayEnumProps & ModelDisplayProps;
export type ModelDisplayFloatProps = DisplayFloatProps & ModelDisplayProps;
export type ModelDisplayIntegerProps = DisplayIntegerProps & ModelDisplayProps;
export type ModelDisplayReferenceProps = DisplayReferenceProps &
  ModelDisplayProps;
export type ModelDisplayStringProps = Omit<DisplayStringProps, 'path'> &
  ModelDisplayProps;
export type ModelDisplayTextProps = DisplayTextProps & ModelDisplayProps;
export type ModelDisplayTimeProps = ModelDisplayDateTimeProps;

// Attachment
export const ModelDisplayAttachmentBase: React.FC<
  ModelDisplayAttachmentProps
> = (props) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayAttachment(props);

  return <DisplayLink {...displayGroupProps} />;
};

// Attachment Image
export const ModelDisplayAttachmentImageBase: React.FC<
  ModelDisplayAttachmentProps
> = (props) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayAttachment(props);

  return <DisplayImage {...displayGroupProps} />;
};

// Attachments
export const ModelDisplayAttachmentsBase: React.FC<
  ModelDisplayAttachmentsProps
> = (props) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayAttachments {...displayGroupProps} />;
};

// Array
export const ModelDisplayArrayBase: React.FC<ModelDisplayArrayProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayArray {...displayGroupProps} />;
};

// Array Reference
export const ModelDisplayArrayReferenceBase: React.FC<
  ModelDisplayArrayReferenceProps
> = (props) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayArrayReference {...displayGroupProps} />;
};

// Boolean
export const ModelDisplayBooleanBase: React.FC<ModelDisplayBooleanProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const { label, ...displayGroupProps } = useModelDisplayGroup(props);

  return <DisplayBoolean {...displayGroupProps}>{label}</DisplayBoolean>;
};

// Currency
export const ModelDisplayCurrencyBase: React.FC<ModelDisplayCurrencyProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayCurrency {...displayGroupProps} />;
};

// Date and Time
export const ModelDisplayDateTimeBase: React.FC<ModelDisplayDateTimeProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayDateTime {...displayGroupProps} />;
};

// Date
export const ModelDisplayDateBase: React.FC<ModelDisplayDateProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayDate {...displayGroupProps} />;
};

// Enum
export const ModelDisplayEnumBase: React.FC<ModelDisplayEnumProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayEnum {...displayGroupProps} />;
};

// Float
export const ModelDisplayFloatBase: React.FC<ModelDisplayFloatProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayFloat {...displayGroupProps} />;
};

// Integer
export const ModelDisplayIntegerBase: React.FC<ModelDisplayIntegerProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayInteger {...displayGroupProps} />;
};

// Reference
export const ModelDisplayReferenceBase: React.FC<ModelDisplayReferenceProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayReference {...displayGroupProps} />;
};

// String
export const ModelDisplayStringBase: React.FC<ModelDisplayStringProps> = (
  originalProps
) => {
  const props = useModelDisplayGroup(originalProps);

  return <DisplayString {...props} />;
};

// Text
export const ModelDisplayTextBase: React.FC<ModelDisplayTextProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayText {...displayGroupProps} />;
};

// Time
export const ModelDisplayTimeBase: React.FC<ModelDisplayTimeProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const displayGroupProps = useModelDisplayGroup(props);

  return <DisplayTime {...displayGroupProps} />;
};

// Overrideable component exports
export const ModelDisplayAttachment: React.FC<ModelDisplayAttachmentProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelDisplayAttachment',
    ModelDisplayAttachmentBase,
    props
  );

export const ModelDisplayAttachmentImage: React.FC<
  ModelDisplayAttachmentImageProps
> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayAttachmentImage',
    ModelDisplayAttachmentImageBase,
    props
  );

export const ModelDisplayAttachments: React.FC<ModelDisplayAttachmentsProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelDisplayAttachments',
    ModelDisplayAttachmentsBase,
    props
  );

export const ModelDisplayArray: React.FC<ModelDisplayArrayProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayArray',
    ModelDisplayArrayBase,
    props
  );

export const ModelDisplayArrayReference: React.FC<
  ModelDisplayArrayReferenceProps
> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayArrayReference',
    ModelDisplayArrayReferenceBase,
    props
  );

export const ModelDisplayBoolean: React.FC<ModelDisplayBooleanProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelDisplayBoolean',
    ModelDisplayBooleanBase,
    props
  );

export const ModelDisplayCurrency: React.FC<ModelDisplayCurrencyProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelDisplayCurrency',
    ModelDisplayCurrencyBase,
    props
  );

export const ModelDisplayDate: React.FC<ModelDisplayDateProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayDate',
    ModelDisplayDateBase,
    props
  );

export const ModelDisplayDateTime: React.FC<ModelDisplayDateTimeProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelDisplayDateTime',
    ModelDisplayDateTimeBase,
    props
  );

export const ModelDisplayEnum: React.FC<ModelDisplayEnumProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayEnum',
    ModelDisplayEnumBase,
    props
  );

export const ModelDisplayFloat: React.FC<ModelDisplayFloatProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayFloat',
    ModelDisplayFloatBase,
    props
  );

export const ModelDisplayInteger: React.FC<ModelDisplayIntegerProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelDisplayInteger',
    ModelDisplayIntegerBase,
    props
  );

export const ModelDisplayReference: React.FC<ModelDisplayReferenceProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelDisplayReference',
    ModelDisplayReferenceBase,
    props
  );

export const ModelDisplayString: React.FC<ModelDisplayStringProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayString',
    ModelDisplayStringBase,
    props
  );

export const ModelDisplayText: React.FC<ModelDisplayTextProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayText',
    ModelDisplayTextBase,
    props
  );

export const ModelDisplayTime: React.FC<ModelDisplayTimeProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayTime',
    ModelDisplayTimeBase,
    props
  );
