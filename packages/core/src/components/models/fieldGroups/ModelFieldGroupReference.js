import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelFieldGroup } from '../../../hooks/form';
import { useModelAndAttributeFromPath } from '../../../hooks/models';
import { getIdentifierAttribute, getModelFromRef } from '../../../utils/models';
import { useId, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import { useModelIndex } from '../../../hooks/queries';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { FieldLayoutVerticalBase } from '../../forms/FieldLayoutVertical';
import { FieldLayoutHorizontalBase } from '../../forms/FieldLayoutHorizontal';
import { FieldLayoutFloatingBase } from '../../forms/FieldLayoutFloating';

// FIXME: This might need to be refactored to use the useModelFieldGroup and/or have a generic typeahead component
export const ModelFieldReferenceBaseInput = ({ model, ...props }) => {
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
  const id = useId();

  return (
    <AsyncTypeahead
      id={id}
      {...fieldProps}
      className={classnames({ 'is-invalid': error })}
      inputProps={{ id: path }}
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

ModelFieldReferenceBaseInput.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const BASE_OVERRIDES = {
  Field: ModelFieldReferenceBaseInput
};

const ModelFieldGroupReferenceVertical = (props) => {
  const { model, fieldGroupProps } = useModelFieldGroup(props);

  return (
    // FIXME: Hack for ModelFieldReferenceBaseInput to do the query
    (<FieldLayoutVerticalBase
      overrides={BASE_OVERRIDES}
      model={model}
      {...fieldGroupProps}
    />)
  );
};

ModelFieldGroupReferenceVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalReference = (props) => {
  const { model, fieldGroupProps } = useModelFieldGroup(props);

  return (
    // FIXME: Hack for ModelFieldReferenceBaseInput to do the query
    (<FieldLayoutHorizontalBase
      overrides={BASE_OVERRIDES}
      model={model}
      {...fieldGroupProps}
    />)
  );
};

export const ModelFieldGroupFloatingReference = (props) => {
  const { model, fieldGroupProps } = useModelFieldGroup(props);

  return (
    <FieldLayoutFloatingBase
      overrides={BASE_OVERRIDES}
      // FIXME: Hack for ModelFieldReferenceBaseInput to do the query
      model={model}
      {...fieldGroupProps}
    />
  );
};

export const ModelFieldGroupReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupReference',
    ModelFieldGroupReferenceVertical,
    props
  );
