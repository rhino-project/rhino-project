import { useFilterPill, useModelFilterField } from '../../../hooks/form';
import { useController, useWatch } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { getIdentifierAttribute, getModelFromRef } from '../../../utils/models';
import { useModelIndex } from '../../../hooks/queries';
import { compact } from 'lodash';
import PropTypes from 'prop-types';

const ModelFilterReferenceTypeahead = ({ model, path, ...props }) => {
  const { filter, limit = 100, offset, order, search } = props;
  const { attribute, operator, plainPath } = useModelFilterField(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const identifier = useMemo(
    () => getIdentifierAttribute(refModel),
    [refModel]
  );
  const [input, setInput] = useState('');
  const {
    field: { onChange, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });
  // We need to use an accessor here because the value can an object or the id
  const referenceAccessor = useCallback(
    (value) => value?.[identifier.name] || value || -1,
    [identifier.name]
  );

  const value = useMemo(
    () => referenceAccessor(fieldValue),
    [fieldValue, referenceAccessor]
  );

  const { isSuccess, results, isInitialLoading } = useModelIndex(refModel, {
    filter,
    limit,
    offset,
    order,
    search: input || search
  });

  // We inject the ID because if we have both 'engagement.project.client'
  // and 'engagement.project' as filters, setting engagement.project.client will
  // cause engagement.project to have an object as a value
  const idPath = `${plainPath}.${identifier.name}`;
  const fullPath = compact([idPath, operator]).join('.');

  const { resetPill, setPill } = useFilterPill(fullPath);
  const pills = useWatch({ name: 'pills' });
  const pill = pills?.[fullPath];

  useEffect(() => {
    if (isSuccess && value) {
      const resource = results.find(
        (r) => String(referenceAccessor(r)) === String(value)
      );

      setPill(resource?.display_name);
    } else if (!value) {
      resetPill();
    }
  }, [results, resetPill, setPill, value, isSuccess, referenceAccessor]);

  useEffect(() => {
    if (!pill) {
      onChange(null);
    }
  }, [onChange, pill]);

  const selectedOption = useMemo(() => {
    if (!value) return [];

    return results?.filter((e) => referenceAccessor(e) === value) || [];
  }, [referenceAccessor, results, value]);

  return (
    <AsyncTypeahead
      id={path}
      clearButton
      options={results ?? []}
      selected={selectedOption}
      isLoading={isInitialLoading}
      onSearch={setInput}
      isInvalid={!!error}
      placeholder={`${attribute.readableName}...`}
      onChange={(selected) => {
        onChange(selected[0]?.id || null);
      }}
      labelKey="display_name"
      delay={500}
      {...fieldProps}
      {...props}
    />
  );
};

ModelFilterReferenceTypeahead.propTypes = {
  model: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterReferenceTypeahead;
