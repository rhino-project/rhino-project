import React, { useId, useMemo, useState } from 'react';
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
  useModelFieldGroup,
  useModelFieldGroupEnum,
  useModelFieldGroupIntegerSelect
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

// Types
export type ModelFieldProps = {
  model: string | Record<string, any>;
  attribute: string;
};
export type ModelFieldBooleanProps = FieldBooleanProps & ModelFieldProps;
export type ModelFieldCountryProps = FieldCountryProps & ModelFieldProps;
export type ModelFieldCurrencyProps = FieldCurrencyProps & ModelFieldProps;
export type ModelFieldDateProps = FieldDateProps & ModelFieldProps;
export type ModelFieldDateTimeProps = FieldDateTimeProps & ModelFieldProps;
export type ModelFieldEnumProps = FieldSelectProps & ModelFieldProps;
export type ModelFieldFileProps = FieldFileProps & ModelFieldProps;
export type ModelFieldFloatProps = FieldFloatProps & ModelFieldProps;
export type ModelFieldIntegerProps = FieldIntegerProps & ModelFieldProps;
export type ModelFieldIntegerSelectProps = FieldSelectProps & ModelFieldProps;
export type ModelFieldOwnerReferenceProps = ModelFieldReferenceProps;
export type ModelFieldPhoneProps = FieldPhoneProps & ModelFieldProps;
export type ModelFieldReferenceProps = AutocompleteProps & ModelFieldProps;
export type ModelFieldStringProps = FieldStringProps & ModelFieldProps;
export type ModelFieldTextProps = FieldTextProps & ModelFieldProps;
export type ModelFieldTimeProps = FieldTimeProps & ModelFieldProps;
export type ModelFieldYearProps = FieldYearProps & ModelFieldProps;

// Boolean
export const ModelFieldBooleanBase: React.FC<ModelFieldBooleanProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const { label, ...fieldGroupProps } = useModelFieldGroup(
    props
  ) as ModelFieldDateProps;

  return <FieldBoolean {...fieldGroupProps}>{label}</FieldBoolean>;
};

// Country
export const ModelFieldCountryBase: React.FC<ModelFieldEnumProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const { fieldGroupProps, ...inputProps } = useModelFieldGroupEnum(
    props
  ) as ModelFieldEnumProps;

  return <FieldCountry {...fieldGroupProps} {...inputProps} />;
};

// Currency
export const ModelFieldCurrencyBase: React.FC<ModelFieldCurrencyProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldCurrencyProps;

  return <FieldCurrency {...fieldGroupProps} />;
};

// Date
export const ModelFieldDateBase: React.FC<ModelFieldDateProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldDateProps;

  return <FieldDate {...fieldGroupProps} />;
};

// Date Time
export const ModelFieldDateTimeBase: React.FC<ModelFieldDateTimeProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldDateTimeProps;

  return <FieldDateTime {...fieldGroupProps} />;
};

// Enum
export const ModelFieldEnumBase: React.FC<ModelFieldEnumProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const { fieldGroupProps, ...inputProps } = useModelFieldGroupEnum(
    props
  ) as ModelFieldEnumProps;

  return <FieldSelect {...fieldGroupProps} {...inputProps} />;
};

// File
export const ModelFieldFileBase: React.FC<ModelFieldFileProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldFloatProps;

  return <FieldFile {...fieldGroupProps} />;
};

// Float
export const ModelFieldFloatBase: React.FC<ModelFieldFloatProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldFloatProps;

  return <FieldFloat {...fieldGroupProps} />;
};

// Integer
export const ModelFieldIntegerBase: React.FC<ModelFieldIntegerProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldIntegerProps;

  return <FieldInteger {...fieldGroupProps} />;
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
    field: { value, onChange, ...fieldProps },
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
export const ModelFieldStringBase: React.FC<ModelFieldStringProps> = (
  props
) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldStringProps;

  return <FieldString {...fieldGroupProps} />;
};

// Text
export const ModelFieldTextBase: React.FC<ModelFieldTextProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldStringProps;

  return <FieldText {...fieldGroupProps} />;
};

// Time
export const ModelFieldTimeBase: React.FC<ModelFieldTimeProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldTimeProps;

  return <FieldTime {...fieldGroupProps} />;
};

// Year
export const ModelFieldYearBase: React.FC<ModelFieldYearProps> = (props) => {
  // FIXME This can be cleaned up a lot
  const fieldGroupProps = useModelFieldGroup(props) as ModelFieldYearProps;

  return <FieldYear {...fieldGroupProps} />;
};

// Overrideable component exports
export const ModelFieldBoolean: React.FC<ModelFieldBooleanProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldBoolean',
    ModelFieldBooleanBase,
    props
  );

export const ModelFieldCountry: React.FC<ModelFieldEnumProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldCountry',
    ModelFieldEnumBase,
    props
  );

export const ModelFieldCurrency: React.FC<ModelFieldCurrencyProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldCurrency',
    ModelFieldCurrencyBase,
    props
  );

export const ModelFieldDate: React.FC<ModelFieldDateProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldDate', ModelFieldDateBase, props);

export const ModelFieldDateTime: React.FC<ModelFieldDateTimeProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldDateTime',
    ModelFieldDateTimeBase,
    props
  );

export const ModelFieldEnum: React.FC<ModelFieldEnumProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldEnum', ModelFieldEnumBase, props);

export const ModelFieldFile: React.FC<ModelFieldFileProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldFile', ModelFieldFileBase, props);

export const ModelFieldFloat: React.FC<ModelFieldFloatProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldFloat', ModelFieldFloatBase, props);

export const ModelFieldInteger: React.FC<ModelFieldIntegerProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldInteger',
    ModelFieldIntegerBase,
    props
  );

export const ModelFieldIntegerSelect: React.FC<ModelFieldIntegerProps> = (
  props
) =>
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

export const ModelFieldString: React.FC<ModelFieldStringProps> = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldString',
    ModelFieldStringBase,
    props
  );

export const ModelFieldText: React.FC<ModelFieldTextProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldText', ModelFieldTextBase, props);

export const ModelFieldTime: React.FC<ModelFieldTimeProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldTime', ModelFieldTimeBase, props);

export const ModelFieldYear: React.FC<ModelFieldYearProps> = (props) =>
  useGlobalComponentForAttribute('ModelFieldYear', ModelFieldYearBase, props);
