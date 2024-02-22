import { useModelFilterField } from '../../../hooks/form';
import { useController } from 'react-hook-form';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { getIdentifierAttribute, getModelFromRef } from '../../../utils/models';
import { useModelIndex } from '../../../hooks/queries';
import { compact } from 'lodash';
import PropTypes from 'prop-types';
import { useModelFiltersContext } from 'rhino/hooks/controllers';

const ModelFilterReferenceTypeahead = ({ model, path, ...props }) => {
  const { filter, limit = 10, offset, order, search } = props;
  const { attribute, operator, plainPath } = useModelFilterField(model, path);
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const identifier = useMemo(
    () => getIdentifierAttribute(refModel),
    [refModel]
  );
  const [input, setInput] = useState('');
  // We inject the ID because if we have both 'engagement.project.client'
  // and 'engagement.project' as filters, setting engagement.project.client will
  // cause engagement.project to have an object as a value
  const idPath = `${plainPath}.${identifier.name}`;
  const fullPath = compact([idPath, operator]).join('.');

  const {
    field: { onChange, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: fullPath
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
    search: input || search,
    queryOptions: { keepPreviousData: true }
  });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (isSuccess && value) {
      const resource = results.find(
        (r) => String(referenceAccessor(r)) === String(value)
      );

      setPill(fullPath, resource?.display_name);
    }
  }, [results, setPill, value, isSuccess, referenceAccessor, fullPath]);

  const selectedOption = useMemo(() => {
    if (!value) return [];

    return (
      results?.filter((e) => String(referenceAccessor(e)) === String(value)) ||
      []
    );
  }, [referenceAccessor, results, value]);

  const id = useId();

  return (
    <AsyncTypeahead
      id={id}
      {...fieldProps}
      minLength={0}
      inputProps={{ id: path }}
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
      {...props}
    />
  );
};

ModelFilterReferenceTypeahead.propTypes = {
  path: PropTypes.string.isRequired
};

export default ModelFilterReferenceTypeahead;
