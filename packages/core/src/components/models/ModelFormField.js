import { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { get, set } from 'lodash';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { Input, InputGroup } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import DatePicker from 'react-datepicker';

import {
  getIdentifierAttribute,
  getModelFromRef,
  getReferenceAttributes
} from 'rhino/utils/models';
import {
  applyCurrencyMaskFromInput,
  getDateTimeFormat,
  optionsFromIndexWithTitle
} from 'rhino/utils/ui';
import ModelNestedManyForm from 'rhino/components/models/ModelNestedManyForm';
import PhoneInput from 'react-phone-input-2';
import ModelFieldFile from 'rhino/components/models/fields/ModelFieldFile';
import ModelFieldCountry from 'rhino/components/models/fields/ModelFieldCountry';
import { useModelIndex } from 'rhino/hooks/queries';
import { useDebouncedState } from 'rhino/hooks/util';
import styles from './ModelFormField.module.scss';

const extractError = (errors, path) => get(errors, `${path}[0]`);

const ModelFormFieldJoinSimple = ({
  attribute,
  error,
  value,
  path,
  onChange
}) => {
  const model = useMemo(() => getModelFromRef(attribute), [attribute]);
  const joinModel = useMemo(
    () =>
      getModelFromRef(
        getReferenceAttributes(model).filter((a) => model.ownedBy !== a.name)[0]
      ),
    [model]
  );

  const { results } = useModelIndex(joinModel);
  const options = useMemo(() => results || [], [results]);

  const currentOptions = useMemo(
    () =>
      value
        ?.filter((v) => v._destroy !== '1')
        ?.map((v) => v[joinModel.name].id || v[joinModel.name]) || [],
    [joinModel, value]
  );

  const selected = useMemo(
    () => options.filter((o) => currentOptions.includes(o.id)),
    [options, currentOptions]
  );

  const handleChange = useCallback(
    (selected) => {
      let newOptions = [...value];

      const selectedIds = selected.map((s) => s.id);

      // Find options that aren't already selected
      selectedIds.forEach((sp) => {
        const existing = newOptions.find(
          (pp) => pp[joinModel.name].id === sp || pp[joinModel.name] === sp
        );

        if (existing) {
          // In case it was previously destroyed, just un-destroy it
          delete existing._destroy;

          return;
        }

        newOptions.push({ [joinModel.name]: sp });
      });

      // Destroy options that are no longer selected
      newOptions = newOptions.map((pp) => {
        const exists =
          selectedIds.includes(pp[joinModel.name].id) ||
          selectedIds.includes(pp[joinModel.name]);

        if (exists) return pp;

        return { ...pp, _destroy: '1' };
      });

      onChange({ [attribute.name]: newOptions });
    },
    [attribute, joinModel, onChange, value]
  );

  return (
    <Typeahead
      id={path}
      className={error ? 'is-invalid' : ''}
      clearButton={attribute.nullable}
      labelKey="display_name"
      multiple
      options={options}
      selected={selected}
      highlightOnlyResult
      isInvalid={!!error}
      onChange={handleChange}
    ></Typeahead>
  );
};

ModelFormFieldJoinSimple.propTypes = {
  attribute: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string
};

const ModelFormFieldReference = ({
  attribute,
  error,
  value,
  path,
  onChange
}) => {
  const model = useMemo(() => getModelFromRef(attribute), [attribute]);
  const identifier = useMemo(() => getIdentifierAttribute(model), [model]);
  const [input, setInput] = useDebouncedState('', 500);

  const { results, isInitialLoading } = useModelIndex(model, {
    limit: 100,
    search: input
  });

  const options = useMemo(() => results || [], [results]);

  const selectedOption = useMemo(() => {
    if (!value) return [];

    // String compare because numbers can be come strings in and out of edits
    // Identifier in case the reference is the full object
    const valString = value?.[identifier.name]
      ? `${value?.[identifier.name]}`
      : `${value}`;

    return options.filter((e) => `${e.id}` === valString);
  }, [options, identifier, value]);

  return (
    <Typeahead
      id={path}
      className={classnames(styles.typeahead, error ? 'is-invalid' : '')}
      clearButton={attribute.nullable}
      labelKey="display_name"
      options={options}
      selected={selectedOption}
      highlightOnlyResult
      isInvalid={!!error}
      onChange={(selected) =>
        onChange(set({}, path, selected[0]?.id || null), selected[0])
      }
      onInputChange={setInput}
      isLoading={isInitialLoading}
    ></Typeahead>
  );
};

ModelFormFieldReference.propTypes = {
  attribute: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string
};

const ModelFormFieldArray = ({ path, value, onChange, ...props }) => {
  return (
    <ModelNestedManyForm
      resources={value}
      onChange={(values) => onChange(set({}, path, values))}
      {...props}
    />
  );
};

ModelFormFieldArray.propTypes = {
  attribute: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  errors: PropTypes.object
};

export const ModelFormFieldIntegerSelect = ({ attribute, value, ...props }) => {
  const integers = Array.from(
    { length: attribute.maximum - attribute.minimum },
    (x, i) => ({
      id: i + attribute.minimum,
      display_name: `${i + attribute.minimum}`
    })
  );

  return (
    <Input {...props} type="select" value={value || -1}>
      {optionsFromIndexWithTitle(integers, `${attribute.readableName}...`)}
    </Input>
  );
};

ModelFormFieldIntegerSelect.propTypes = {
  attribute: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
};

export const ModelFormFieldInteger = ({
  attribute,
  value,
  error,
  ...props
}) => {
  return (
    <Input
      {...props}
      type="number"
      value={value}
      autoComplete="off"
      invalid={!!error}
      min={attribute.minimum}
      max={attribute.maximum}
    />
  );
};

ModelFormFieldInteger.propTypes = {
  attribute: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
};

export const ModelFormFieldCurrency = ({ error, onChange, ...commonProps }) => {
  const inputRef = useRef(null);
  const handleOnChange = useCallback(
    (event) => {
      const formattedValue = applyCurrencyMaskFromInput(event);
      onChange(formattedValue.value);
      if (inputRef.current) {
        inputRef.current.value = formattedValue.value;
        inputRef.current.setSelectionRange(
          formattedValue.selectionStart,
          formattedValue.selectionEnd
        );
      }
    },
    [onChange]
  );

  return (
    <InputGroup
      className={classnames({
        'is-invalid': error
      })}
    >
      <span className="input-group-text">$</span>
      <Input
        {...commonProps}
        onChange={handleOnChange}
        className={classnames({ 'is-invalid': !!error })}
      />
    </InputGroup>
  );
};

ModelFormFieldCurrency.propTypes = {
  path: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

// FIXME: Hack because its the same number value
export const ModelFormFieldFloat = (props) => (
  <ModelFormFieldInteger {...props} />
);

export const ModelFormFieldEnum = ({ attribute, error, value, ...props }) => {
  const integers = attribute.enum.map((e) => ({
    id: e,
    display_name: e
  }));

  return (
    <Input {...props} type="select" invalid={!!error} value={value || -1}>
      {optionsFromIndexWithTitle(integers, `${attribute.readableName}...`)}
    </Input>
  );
};

ModelFormFieldEnum.propTypes = {
  attribute: PropTypes.object.isRequired,
  error: PropTypes.string,
  value: PropTypes.string.isRequired
};

const ModelFormFieldDatetime = ({
  attribute,
  path,
  error,
  value,
  onChange,
  type
}) => {
  //Replacing - with / in case that attribute.format is date. Otherwise new Date() returns one day off. Read more: https://stackoverflow.com/a/31732581
  const date = useMemo(
    () =>
      value && type === 'date'
        ? new Date(value.replace(/-/g, `/`).replace(/T.+/, ''))
        : value && type !== 'date'
        ? new Date(value)
        : '',
    [type, value]
  );

  const handleChangeDate = (date) =>
    onChange(set({}, path, date?.toISOString() || null));

  return (
    <DatePicker
      id={path}
      className={classnames('d-block', 'form-control', { 'is-invalid': error })}
      wrapperClassName={classnames('d-block', { 'is-invalid': error })}
      selected={date}
      onChange={handleChangeDate}
      showTimeSelect={type === 'time' || type === 'datetime'} //Time input can be text input too using 'showTimeInput'
      showTimeSelectOnly={type === 'time'}
      isClearable={attribute.nullable}
      dateFormat={getDateTimeFormat(attribute)}
    />
  );
};

ModelFormFieldDatetime.propTypes = {
  attribute: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string.isRequired
};

const ModelFormFieldYear = ({ attribute, path, error, value, onChange }) => {
  const year = useMemo(() => (value ? new Date(value, 1, 1) : undefined), [
    value
  ]);
  const minYear = useMemo(
    () => (attribute.minimum ? new Date(attribute.minimum, 1, 1) : undefined),
    [attribute]
  );
  const maxYear = useMemo(
    () => (attribute.maximum ? new Date(attribute.maximum, 1, 1) : undefined),
    [attribute]
  );

  const handleChangeDate = (date) =>
    onChange(set({}, path, date?.getFullYear() || null));

  return (
    <DatePicker
      id={path}
      className={classnames('d-block', 'form-control', { 'is-invalid': error })}
      wrapperClassName={classnames('d-block', { 'is-invalid': error })}
      selected={year}
      onChange={handleChangeDate}
      minDate={minYear}
      maxDate={maxYear}
      showYearPicker
      isClearable={attribute.nullable}
      dateFormat={getDateTimeFormat(attribute)}
    />
  );
};

ModelFormFieldYear.propTypes = {
  attribute: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func
};

const ModelFormFieldPhone = ({ attribute, path, error, value, onChange }) => {
  const handlePhoneChange = (phone) => onChange({ [attribute.name]: phone });

  return (
    <PhoneInput
      containerClass={classnames({ 'is-invalid': error })}
      value={value}
      country="us"
      preferredCountries={['us', 'ca']}
      regions={['north-america', 'europe']}
      onChange={handlePhoneChange}
    />
  );
};

ModelFormFieldPhone.propTypes = {
  attribute: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func
};

const ModelFormField = ({
  attribute,
  autoFocus,
  errors,
  path,
  resource,
  onChange,
  onBlur
}) => {
  const error = extractError(errors, path);
  const value = get(resource, path, attribute.default || '');

  const handleChange = ({ target: { value } }) => {
    if (attribute.pattern) {
      const regex = new RegExp(attribute.pattern);

      if (!value.match(regex)) return;
    }

    onChange(set(resource, path, value));
  };

  // Create a unique id so that there is never a conflict for things like Input
  // if you have the same formfield on a path
  const id = useMemo(() => `${path}-${uuidv4()}`, [path]);

  const commonProps = {
    key: path,
    autoFocus,
    id,
    attribute,
    resource,
    path,
    value,
    onChange: handleChange,
    error
  };

  switch (attribute.type) {
    case 'array':
      if (attribute?.items?.type === 'string') {
        return (
          <Typeahead
            {...commonProps}
            className={error ? 'is-invalid' : ''}
            clearButton={attribute.nullable}
            allowNew
            multiple
            options={value || []}
            selected={value || []}
            isInvalid={!!error}
            onChange={(selected) => {
              const normalized_selected = selected.map((s) =>
                typeof s === 'string' ? s : s?.label
              );
              onChange(set({}, path, normalized_selected));
            }}
            // {...props}
          />
        );
      } else if (attribute?.items?.type === 'integer') {
        // Value might be '' to start
        const stringValues =
          (Array.isArray(value) ? value?.map((v) => v.toString()) : value) ||
          [];

        // FIXME: [NUB-1227] This is a hack to get around the fact that the Typeahead component doesn't support numbers
        return (
          <Typeahead
            {...commonProps}
            className={error ? 'is-invalid' : ''}
            clearButton={attribute.nullable}
            allowNew
            multiple
            options={stringValues}
            selected={stringValues}
            isInvalid={!!error}
            onChange={(selected) => {
              const normalized_selected = selected.map((s) =>
                typeof s === 'string' ? s : s?.label
              );
              onChange(set({}, path, normalized_selected));
            }}
            // {...props}
          />
        );
      } else if (
        attribute?.items?.anyOf?.[0]?.['$ref']?.endsWith('_attachment')
      ) {
        return <ModelFieldFile {...commonProps} multiple onChange={onChange} />;
      } else {
        if (attribute.format === 'join_table_simple') {
          return (
            <ModelFormFieldJoinSimple
              {...commonProps}
              value={value || []}
              errors={errors}
              resource={resource}
              onChange={(values) => onChange(values)}
            />
          );
        }
        return (
          <ModelFormFieldArray
            {...commonProps}
            value={value || []}
            errors={errors}
            resource={resource}
            onChange={(values) => onChange(values)}
          />
        );
      }
    case 'reference':
      if (path.endsWith('_attachment')) {
        return <ModelFieldFile {...commonProps} onChange={onChange} />;
      } else {
        return <ModelFormFieldReference {...commonProps} onChange={onChange} />;
      }
    case 'boolean':
      return (
        <Input
          {...commonProps}
          className={classnames({ 'is-invalid': !!error })}
          type="checkbox"
          checked={value}
          onChange={() => onChange(set({}, path, !value))}
        />
      );
    case 'integer':
      switch (attribute.format) {
        case 'year':
          return <ModelFormFieldYear {...commonProps} onChange={onChange} />;
        case 'select':
          return <ModelFormFieldIntegerSelect {...commonProps} value={value} />;
        default:
          return <ModelFormFieldInteger {...commonProps} value={value} />;
      }
    case 'decimal':
    case 'float':
    case 'number':
      if (attribute.format === 'currency') {
        return <ModelFormFieldCurrency {...commonProps} value={value} />;
      }
      return <ModelFormFieldFloat {...commonProps} value={value} />;
    case 'text':
      return <Input {...commonProps} type="textarea" invalid={!!error} />;

    case 'string':
      if (attribute.enum) {
        return <ModelFormFieldEnum {...commonProps} value={value} />;
      }

      // eslint-disable-next-line default-case
      switch (attribute.format) {
        case 'datetime':
        case 'time':
        case 'date':
          return (
            <ModelFormFieldDatetime
              {...commonProps}
              onChange={onChange}
              type={attribute.format}
            />
          );
        case 'phone':
          return <ModelFormFieldPhone {...commonProps} onChange={onChange} />;
        case 'country':
          return <ModelFieldCountry {...commonProps} onChange={onChange} />;
      }
    // eslint-disable no-fallthrough
    default:
      return <Input {...commonProps} autoComplete="off" invalid={!!error} />;
  }
};

ModelFormField.propTypes = {
  attribute: PropTypes.object.isRequired,
  errors: PropTypes.object,
  label: PropTypes.string,
  path: PropTypes.string,
  resource: PropTypes.object,
  onChange: PropTypes.func
};

export default ModelFormField;
