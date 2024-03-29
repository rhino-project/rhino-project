import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useCallback, useId } from 'react';
import { useController } from 'react-hook-form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useModelFieldGroup } from '../../../hooks/form';
import { FieldLayoutVerticalBase } from '../../forms/FieldLayoutVertical';
import { FieldLayoutFloatingBase } from '../../forms/FieldLayoutFloating';
import { FieldLayoutHorizontalBase } from '../../forms/FieldLayoutHorizontal';

// FIXME: This might need to be refactored to use the useModelFieldGroup and/or have a generic typeahead component
export const ModelFieldArrayIntegerBaseInput = ({ nullable, ...props }) => {
  const { path } = props;

  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const stringValues =
    (Array.isArray(value) ? value?.map((v) => v.toString()) : value) || [];

  const handleChange = useCallback(
    (selected) => {
      const normalized_selected = selected.map((s) =>
        typeof s === 'string' ? s : s?.label
      );

      onChange(normalized_selected);
    },
    [onChange]
  );
  const id = useId();

  return (
    <Typeahead
      id={id}
      {...fieldProps}
      className={error ? 'is-invalid' : ''}
      inputProps={{ id: path }}
      clearButton={nullable}
      allowNew
      multiple
      options={stringValues}
      selected={stringValues}
      isInvalid={!!error}
      onChange={handleChange}
      {...props}
    />
  );
};

ModelFieldArrayIntegerBaseInput.propTypes = {
  path: PropTypes.string.isRequired
};

const BASE_OVERRIDES = {
  Field: ModelFieldArrayIntegerBaseInput
};

const ModelFieldGroupArrayIntegerVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return (
    <FieldLayoutVerticalBase overrides={BASE_OVERRIDES} {...fieldGroupProps} />
  );
};

ModelFieldGroupArrayIntegerVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalArrayInteger = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return (
    <FieldLayoutHorizontalBase
      overrides={BASE_OVERRIDES}
      {...fieldGroupProps}
    />
  );
};

export const ModelFieldGroupFloatingArrayInteger = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return (
    <FieldLayoutFloatingBase overrides={BASE_OVERRIDES} {...fieldGroupProps} />
  );
};

export const ModelFieldGroupArrayInteger = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupArrayInteger',
    ModelFieldGroupArrayIntegerVertical,
    props
  );
