import PropTypes from 'prop-types';
import { useMemo } from 'react';
import classnames from 'classnames';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useController } from 'react-hook-form';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import { useModelIndex } from 'rhino/hooks/queries';
import { useDebouncedState } from 'rhino/hooks/util';
import { getIdentifierAttribute, getModelFromRef } from 'rhino/utils/models';

export const ModelFieldReferenceBase = ({ model, ...props }) => {
  const { path, filter, limit = 100, offset, order } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const identifier = useMemo(() => getIdentifierAttribute(refModel), [
    refModel
  ]);
  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const [input, setInput] = useDebouncedState('', 500);

  const { results, isLoading } = useModelIndex(refModel, {
    search: input,
    filter,
    limit,
    offset,
    order
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

  const handleChange = (selected) => onChange(selected[0] || null);

  return (
    <Typeahead
      id={path}
      {...fieldProps}
      // className={classnames(styles.typeahead, error ? 'is-invalid' : '')}
      className={classnames({ 'is-invalid': error })}
      clearButton={attribute.nullable}
      labelKey="display_name"
      options={options}
      selected={selectedOption}
      highlightOnlyResult
      isInvalid={!!error}
      onChange={handleChange}
      onInputChange={setInput}
      isLoading={isLoading}
      {...props}
    />
  );
};

const defaultComponents = { ModelFieldReference: ModelFieldReferenceBase };

const ModelFieldReference = ({ overrides, ...props }) => {
  const { ModelFieldReference } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldReference {...props} />;
};

ModelFieldReference.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldReference;
