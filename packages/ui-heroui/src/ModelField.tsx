import React, { useMemo, useState } from 'react';
import {
  useBaseOwnerFilters,
  useGlobalComponentForAttribute,
  useModelAndAttributeFromPath,
  useModelIndex
} from '@rhino-project/core/hooks';
import {
  FieldBoolean,
  FieldBooleanProps,
  FieldCountry,
  FieldCountryProps,
  FieldCurrency,
  FieldCurrencyProps,
  FieldDate,
  FieldDateProps,
  FieldDateTime,
  FieldDateTimeProps,
  FieldFile,
  FieldFileProps,
  FieldFloat,
  FieldFloatProps,
  FieldInteger,
  FieldIntegerProps,
  FieldPhone,
  FieldPhoneProps,
  FieldString,
  FieldStringProps,
  FieldText,
  FieldTextProps,
  FieldTime,
  FieldTimeProps,
  FieldYear,
  FieldYearProps
} from './Field';
import {
  useModelFieldBooleanProps,
  useModelFieldDateTimeProps,
  useModelFieldEnumProps,
  useModelFieldGroup,
  useModelFieldGroupEnum,
  useModelFieldGroupIntegerSelect,
  useModelFieldInputProps,
  useModelFieldTimeProps
} from './form';
import { FieldSelect, FieldSelectProps } from './FieldSelect';
import {
  getIdentifierAttribute,
  getModelFromRef
} from '@rhino-project/core/utils';
import { useController } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps
} from '@heroui/react';
import { CountrySelectorProps } from 'react-international-phone';

// Types
export type ModelFieldProps = {
  model: string | Record<string, unknown>;
  attribute: string;
};
export type ModelFieldCountryProps = FieldCountryProps & ModelFieldProps;
export type ModelFieldFileProps = FieldFileProps & ModelFieldProps;
export type ModelFieldIntegerSelectProps = FieldSelectProps & ModelFieldProps;
export type ModelFieldOwnerReferenceProps = ModelFieldReferenceProps;
export type ModelFieldPhoneProps = FieldPhoneProps & ModelFieldProps;
export type ModelFieldReferenceProps = AutocompleteProps & ModelFieldProps;

// Boolean
export const ModelFieldBooleanBase: React.FC<FieldBooleanProps> = (props) => {
  const fieldProps = useModelFieldBooleanProps(props);

  return <FieldBoolean {...fieldProps} />;
};

// Country
export const ModelFieldCountryBase: React.FC<CountrySelectorProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const { fieldGroupProps, ...inputProps } = useModelFieldGroupEnum(
    props
  ) as ModelFieldProps;

  return <FieldCountry {...fieldGroupProps} {...inputProps} />;
};

// Currency
export const ModelFieldCurrencyBase: React.FC<FieldCurrencyProps> = (props) => {
  const fieldProps = useModelFieldInputProps(props);

  return <FieldCurrency {...fieldProps} />;
};

// Date
export const ModelFieldDateBase: React.FC<FieldDateProps> = (props) => {
  const fieldProps = useModelFieldDateTimeProps(props);

  return <FieldDate {...fieldProps} />;
};

// Date Time
export const ModelFieldDateTimeBase: React.FC<FieldDateTimeProps> = (props) => {
  const fieldProps = useModelFieldDateTimeProps(props);

  return <FieldDateTime {...fieldProps} />;
};

// Enum
export const ModelFieldEnumBase: React.FC<FieldSelectProps> = (props) => {
  const fieldProps = useModelFieldEnumProps(props);

  return <FieldSelect {...fieldProps} />;
};

// File
export const ModelFieldFileBase: React.FC<ModelFieldFileProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldFloatProps;

  return <FieldFile {...fieldGroupProps} />;
};

// Float
export const ModelFieldFloatBase: React.FC<FieldFloatProps> = (props) => {
  const fieldProps = useModelFieldInputProps(props);

  return <FieldFloat {...fieldProps} />;
};

// Integer
export const ModelFieldIntegerBase: React.FC<FieldIntegerProps> = (props) => {
  const fieldProps = useModelFieldInputProps(props);

  return <FieldInteger {...fieldProps} />;
};

// Integer Select
export const ModelFieldIntegerSelectBase: React.FC<ModelFieldEnumProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const { fieldGroupProps, ...inputProps } = useModelFieldGroupIntegerSelect(
    props
  ) as ModelFieldIntegerSelectProps;

  return <FieldSelect {...fieldGroupProps} {...inputProps} />;
};

// Owner Reference
export const ModelFieldOwnerReferenceBase: React.FC<
  ModelFieldOwnerReferenceProps
> = ({ filter: extraFilters, ...props }) => {
  const { model, path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const filter = useBaseOwnerFilters(refModel, { extraFilters });

  return <ModelFieldReference filter={filter} {...props} />;
};

// Phone
export const ModelFieldPhoneBase: React.FC<ModelFieldPhoneProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldPhoneProps;

  return <FieldPhone {...fieldGroupProps} />;
};

// Reference
// FIXME: need to allow limit, offset, etc in props
export const ModelFieldReferenceBase: React.FC<ModelFieldReferenceProps> = ({
  filter: propsFilter,
  limit = 10,
  offset,
  order,
  ...props
}) => {
  const { path } = props;
  const { model, ...fieldGroupProps } = useModelFieldGroup(props);
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const identifier = useMemo(
    () => getIdentifierAttribute(refModel),
    [refModel]
  );
  const {
    field: { disabled, value, onChange, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  // The value might be a whole object or just the identifier
  const valString = useMemo(
    () =>
      value?.[identifier.name] ? `${value?.[identifier.name]}` : `${value}`,
    [value, identifier]
  );

  const [search, setSearch] = useState('');

  // Filter by identifier if value is set
  const filter = useMemo(() => {
    if (!value) return propsFilter;

    return { ...propsFilter, [identifier.name]: valString };
  }, [identifier.name, propsFilter, valString, value]);

  const { results, isInitialLoading } = useModelIndex(refModel, {
    search,
    filter,
    limit,
    offset,
    order,
    queryOptions: {
      // Keep previous data so that the selected option doesn't disappear when selected
      // as the results are refetched with the new filter based on valString
      keepPreviousData: true
    }
  });

  return (
    <Autocomplete
      isLoading={isInitialLoading}
      onInputChange={setSearch}
      items={results || []}
      selectedKey={valString}
      onSelectionChange={(a) => onChange(a)}
      isInvalid={!!error}
      errorMessage={error?.message}
      isDisabled={disabled}
      {...fieldGroupProps}
      {...fieldProps}
    >
      {(item) => (
        <AutocompleteItem key={item[identifier.name]}>
          {item.display_name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

// String
export const ModelFieldStringBase: React.FC<FieldStringProps> = (props) => {
  const fieldProps = useModelFieldInputProps(props);

  return <FieldString {...fieldProps} />;
};

// Text
export const ModelFieldTextBase: React.FC<FieldTextProps> = (props) => {
  const fieldProps = useModelFieldInputProps(props);

  return <FieldText {...fieldProps} />;
};

// Time
export const ModelFieldTimeBase: React.FC<FieldTimeProps> = (props) => {
  const fieldProps = useModelFieldTimeProps(props);

  return <FieldTime {...fieldProps} />;
};

// Year
export const ModelFieldYearBase: React.FC<FieldYearProps> = (props) => {
  const fieldProps = useModelFieldInputProps(props);

  return <FieldYear {...fieldProps} />;
};

// Overrideable component exports
export const ModelFieldBoolean: React.FC<FieldBooleanProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldBoolean',
    ModelFieldBooleanBase,
    props
  );

export const ModelFieldCountry: React.FC<ModelFieldProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldCountry',
    ModelFieldEnumBase,
    props
  );

export const ModelFieldCurrency: React.FC<FieldCurrencyProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldCurrency',
    ModelFieldCurrencyBase,
    props
  );

export const ModelFieldDate: React.FC<FieldDateProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldDate', ModelFieldDateBase, props);

export const ModelFieldDateTime: React.FC<FieldDateTimeProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldDateTime',
    ModelFieldDateTimeBase,
    props
  );

export const ModelFieldEnum: React.FC<FieldSelectProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldEnum', ModelFieldEnumBase, props);

export const ModelFieldFile: React.FC<ModelFieldFileProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldFile', ModelFieldFileBase, props);

export const ModelFieldFloat: React.FC<FieldFloatProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldFloat', ModelFieldFloatBase, props);

export const ModelFieldInteger: React.FC<FieldIntegerProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldInteger',
    ModelFieldIntegerBase,
    props
  );

export const ModelFieldIntegerSelect: React.FC<FieldIntegerProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldIntegerSelect',
    ModelFieldIntegerSelectBase,
    props
  );

export const ModelFieldPhone: React.FC<ModelFieldPhoneProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldPhone', ModelFieldPhoneBase, props);

export const ModelFieldOwnerReference: React.FC<
  ModelFieldOwnerReferenceProps
> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldOwnerReference',
    ModelFieldOwnerReferenceBase,
    props
  );

export const ModelFieldReference: React.FC<ModelFieldReferenceProps> = (
  props
) =>
  useGlobalComponentForAttribute(
    'ModelFieldReference',
    ModelFieldReferenceBase,
    props
  );

export const ModelFieldString: React.FC<FieldStringProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldString',
    ModelFieldStringBase,
    props
  );

export const ModelFieldText: React.FC<FieldTextProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldText', ModelFieldTextBase, props);

export const ModelFieldTime: React.FC<FieldTimeProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldTime', ModelFieldTimeBase, props);

export const ModelFieldYear: React.FC<FieldYearProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldYear', ModelFieldYearBase, props);
