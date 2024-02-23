import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useCallback, useId } from 'react';
import { useController } from 'react-hook-form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useModelFieldGroup } from '../../../hooks/form';
import { FieldLayoutVerticalBase } from '../../forms/FieldLayoutVertical';
import { FieldLayoutHorizontalBase } from '../../forms/FieldLayoutHorizontal';
import { FieldLayoutFloatingBase } from '../../forms/FieldLayoutFloating';

// FIXME: This might need to be refactored to use the useModelFieldGroup and/or have a generic typeahead component
export const ModelFieldArrayStringBaseInput = ({ nullable, ...props }) => {
  const { path } = props;

  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

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
      inputProps={{ id: path }}
      className={error ? 'is-invalid' : ''}
      clearButton={nullable}
      allowNew
      multiple
      options={value || []}
      selected={value || []}
      isInvalid={!!error}
      onChange={handleChange}
      {...props}
    />
  );
};

const BASE_OVERRIDES = {
  Field: ModelFieldArrayStringBaseInput
};

const ModelFieldGroupArrayStringVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return (
    <FieldLayoutVerticalBase overrides={BASE_OVERRIDES} {...fieldGroupProps} />
  );
};

ModelFieldGroupArrayStringVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalArrayString = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return (
    <FieldLayoutHorizontalBase
      overrides={BASE_OVERRIDES}
      {...fieldGroupProps}
    />
  );
};

export const ModelFieldGroupFloatingArrayString = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return (
    <FieldLayoutFloatingBase overrides={BASE_OVERRIDES} {...fieldGroupProps} />
  );
};

export const ModelFieldGroupArrayString = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupArrayString',
    ModelFieldGroupArrayStringVertical,
    props
  );
