import React from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import {
  FieldBoolean,
  FieldBooleanProps,
  FieldDate,
  FieldDateProps,
  FieldDateTime,
  FieldDateTimeProps,
  FieldTime,
  FieldTimeProps
} from './Field';
import { FilterInput, FilterInputProps } from './FilterInput';

// Types
export type FilterBooleanProps = FieldBooleanProps;
export type FilterDateProps = FieldDateProps;
export type FilterDateTimeProps = FieldDateTimeProps;
export type FilterFloatProps = FilterInputProps;
export type FilterIntegerProps = FilterInputProps;
export type FilterStringProps = FilterInputProps;
export type FilterTimeProps = FieldTimeProps;
export type FilterYearProps = FilterInputProps;

// Date
export const FilterBooleanBase = React.forwardRef<
  HTMLInputElement,
  FieldBooleanProps
>((props, ref) => {
  return <FieldBoolean ref={ref} {...props} />;
});
FilterBooleanBase.displayName = 'FilterBooleanBase';

// Date
export const FilterDateBase = React.forwardRef<
  HTMLInputElement,
  FilterDateProps
>((props, ref) => {
  return <FieldDate ref={ref} {...props} />;
});
FilterDateBase.displayName = 'FilterDateBase';

// DateTime
export const FilterDateTimeBase = React.forwardRef<
  HTMLInputElement,
  FilterDateTimeProps
>((props, ref) => {
  return <FieldDateTime ref={ref} {...props} />;
});
FilterDateTimeBase.displayName = 'FilterDateTimeBase';

// Float
export const FilterFloatBase = React.forwardRef<
  HTMLInputElement,
  FilterFloatProps
>((props, ref) => {
  return <FilterInput ref={ref} type="number" {...props} />;
});
FilterFloatBase.displayName = 'FilterFloatBase';

// Integer
export const FilterIntegerBase = React.forwardRef<
  HTMLInputElement,
  FilterIntegerProps
>((props, ref) => {
  return <FilterInput ref={ref} type="number" {...props} />;
});
FilterIntegerBase.displayName = 'FilterIntegerBase';

// String
export const FilterStringBase = React.forwardRef<
  HTMLInputElement,
  FilterStringProps
>((props, ref) => {
  return <FilterInput ref={ref} {...props} />;
});
FilterStringBase.displayName = 'FilterStringBase';

// Time
export const FilterTimeBase = React.forwardRef<
  HTMLInputElement,
  FilterTimeProps
>((props, ref) => {
  return <FieldTime ref={ref} {...props} />;
});
FilterTimeBase.displayName = 'FilterTimeBase';

// Year
export const FilterYearBase = React.forwardRef<
  HTMLInputElement,
  FilterYearProps
>((props, ref) => {
  return <FilterInput ref={ref} type="number" {...props} />;
});
FilterYearBase.displayName = 'FilterYearBase';

// Overrideable component exports
export const FilterBoolean = (props: FilterBooleanProps) =>
  useGlobalComponent('FilterBoolean', FilterBooleanBase, props);

export const FilterDate = (props: FilterDateProps) =>
  useGlobalComponent('FilterDate', FilterDateBase, props);

export const FilterDateTime = (props: FilterDateTimeProps) =>
  useGlobalComponent('FilterDateTime', FilterDateTimeBase, props);

export const FilterFloat = (props: FilterFloatProps) =>
  useGlobalComponent('FilterFloat', FilterFloatBase, props);

export const FilterInteger = (props: FilterIntegerProps) =>
  useGlobalComponent('FilterInteger', FilterIntegerBase, props);

export const FilterString = (props: FilterStringProps) =>
  useGlobalComponent('FilterString', FilterStringBase, props);

export const FilterTime = (props: FilterTimeProps) =>
  useGlobalComponent('FilterTime', FilterTimeBase, props);

export const FilterYear = (props: FilterYearProps) =>
  useGlobalComponent('FilterYear', FilterYearBase, props);
