import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useController } from 'react-hook-form';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

export const ModelFieldArrayStringBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

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

  return (
    <Typeahead
      id={path}
      {...fieldProps}
      className={error ? 'is-invalid' : ''}
      clearButton={attribute.nullable}
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

const defaultComponents = { ModelFieldArrayString: ModelFieldArrayStringBase };

const ModelFieldArrayString = ({ overrides, ...props }) => {
  const { ModelFieldArrayString } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldArrayString {...props} />;
};

ModelFieldArrayString.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldArrayString;
