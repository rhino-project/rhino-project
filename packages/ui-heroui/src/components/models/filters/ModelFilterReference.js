import PropTypes from 'prop-types';
import { compact } from 'lodash-es';
import { useWatch } from 'react-hook-form';

import { useCallback, useEffect, useMemo } from 'react';
import {
  getIdentifierAttribute,
  getModelFromRef
} from '@rhino-project/core/utils';
import { useModelIndex } from '@rhino-project/core/hooks';
import { useModelFilterField } from '../../../form';
import {
  useModelFiltersContext,
  useGlobalComponent
} from '@rhino-project/core/hooks';
import { FieldSelect } from '../../../FieldSelect';
import { SelectItem } from '@heroui/react';

export const ModelFilterReferenceBase = ({
  path,
  filter,
  limit = 100,
  offset,
  order,
  search,
  ...props
}) => {
  const { attribute, operator, plainPath, ...rest } = useModelFilterField(path);

  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const identifier = useMemo(
    () => getIdentifierAttribute(refModel),
    [refModel]
  );

  // We need to use an accessor here because the value can an object or the id
  const referenceAccessor = useCallback(
    (value) => value?.[identifier.name] || value,
    [identifier.name]
  );

  const { isSuccess, results } = useModelIndex(refModel, {
    filter,
    limit,
    offset,
    order,
    search
  });

  // We inject the ID because if we have both 'engagement.project.client'
  // and 'engagement.project' as filters, setting engagement.project.client will
  // cause engagement.project to have an object as a value
  const idPath = `${plainPath}.${identifier.name}`;
  const fullPath = compact([idPath, operator]).join('.');

  const watch = useWatch({ name: fullPath });

  const { setPill } = useModelFiltersContext(fullPath);

  useEffect(() => {
    if (isSuccess && watch !== undefined) {
      const resource = results.find((r) => `${r[identifier.name]}` === watch);

      setPill(fullPath, resource?.display_name || null);
    }
  }, [identifier.name, results, setPill, watch, isSuccess, fullPath]);

  // If there is no order, we sort by display_name
  // This has to be client side because display_name is not a sortable field in the database
  const sortedResults = useMemo(() => {
    if (order) return results;

    return results?.sort((a, b) =>
      a?.display_name.localeCompare(b?.display_name, undefined, {
        sensitivity: 'base'
      })
    );
  }, [results, order]);

  return (
    <FieldSelect
      id={plainPath}
      path={fullPath}
      accessor={referenceAccessor}
      {...rest}
      {...props}
    >
      {/* FIXME Should be a function with items */}
      {sortedResults?.map((result) => (
        <SelectItem key={result.id} textValue={result.display_name}>
          {result.display_name}
        </SelectItem>
      ))}
    </FieldSelect>
  );
};

ModelFilterReferenceBase.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export const ModelFilterReference = (props) =>
  useGlobalComponent('ModelFilterReference', ModelFilterReferenceBase, props);
