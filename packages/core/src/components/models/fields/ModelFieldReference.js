import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import classnames from 'classnames';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useController } from 'react-hook-form';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import { useModelIndex } from 'rhino/hooks/queries';
import { getIdentifierAttribute, getModelFromRef } from 'rhino/utils/models';

export const ModelFieldReferenceBase = ({ model, ...props }) => {
  const { path, limit = 10, offset, order } = props;
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

  const valString = useMemo(
    () =>
      value?.[identifier.name] ? `${value?.[identifier.name]}` : `${value}`,
    [value, identifier]
  );

  const [search, setSearch] = useState('');

  const filter = useMemo(() => {
    if (!value) return props.filter;

    return { ...props.filter, [identifier.name]: valString };
  }, [identifier.name, props.filter, valString, value]);

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

  const selectedOption = useMemo(() => {
    if (!value) return [];

    // String compare because numbers can be come strings in and out of edits
    // Identifier in case the reference is the full object
    return results?.filter((e) => `${e.id}` === valString);
  }, [results, value, valString]);

  const handleChange = (selected) => onChange(selected[0] || null);

  return (
    <AsyncTypeahead
      id={path}
      {...fieldProps}
      className={classnames({ 'is-invalid': error })}
      clearButton={attribute.nullable}
      labelKey="display_name"
      options={results || []}
      selected={selectedOption}
      highlightOnlyResult
      isInvalid={!!error}
      onChange={handleChange}
      onSearch={(query) => setSearch(query)}
      isLoading={isInitialLoading}
      minLength={0}
      {...props}
    />
  );
};

ModelFieldReferenceBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldReference = (props) =>
  useGlobalComponent('ModelFieldReference', ModelFieldReferenceBase, props);

export default ModelFieldReference;
