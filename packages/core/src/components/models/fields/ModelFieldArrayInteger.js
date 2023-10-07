import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useController } from 'react-hook-form';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

export const ModelFieldArrayIntegerBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

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

  return (
    <Typeahead
      id={path}
      {...fieldProps}
      className={error ? 'is-invalid' : ''}
      clearButton={attribute.nullable}
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

ModelFieldArrayIntegerBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldArrayInteger = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldArrayInteger',
    ModelFieldArrayIntegerBase,
    props
  );

export default ModelFieldArrayInteger;
