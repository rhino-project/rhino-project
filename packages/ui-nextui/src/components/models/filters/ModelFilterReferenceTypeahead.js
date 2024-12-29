import { useModelFilterField } from '../../../form';
import { useController } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getIdentifierAttribute,
  getModelFromRef
} from '@rhino-project/core/utils';
import { useModelIndex } from '@rhino-project/core/hooks';
import { compact } from 'lodash-es';
import PropTypes from 'prop-types';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { Autocomplete, AutocompleteItem } from '@heroui/react';

export const ModelFilterReferenceTypeahead = ({ model, path, ...props }) => {
  const { filter, limit = 10, offset, order } = props;
  const { attribute, operator, plainPath, ...rest } = useModelFilterField(
    model,
    path
  );
  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const identifier = useMemo(
    () => getIdentifierAttribute(refModel),
    [refModel]
  );
  const [search, setSearch] = useState('');
  // We inject the ID because if we have both 'engagement.project.client'
  // and 'engagement.project' as filters, setting engagement.project.client will
  // cause engagement.project to have an object as a value
  const idPath = `${plainPath}.${identifier.name}`;
  const fullPath = compact([idPath, operator]).join('.');

  const {
    field: { onChange, value: fieldValue, ...fieldProps }
  } = useController({
    name: fullPath
  });

  // We need to use an accessor here because the value can an object or the id
  const referenceAccessor = useCallback(
    (value) => value?.[identifier.name] || value || null,
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
    search,
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

  return (
    <Autocomplete
      isLoading={isInitialLoading}
      items={results || []}
      onInputChange={setSearch}
      onSelectionChange={(value) => onChange(value)}
      selectedKey={value}
      {...fieldProps}
      {...rest}
      {...props}
    >
      {(item) => (
        <AutocompleteItem key={item[identifier.name]}>
          {item.display_name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

ModelFilterReferenceTypeahead.propTypes = {
  path: PropTypes.string.isRequired
};
