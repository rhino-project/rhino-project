import PropTypes from 'prop-types';
import { compact } from 'lodash';
import { useWatch } from 'react-hook-form';

import { optionsFromIndexWithTitle } from 'rhino/utils/ui';
import { useCallback, useEffect, useMemo } from 'react';
import { getIdentifierAttribute, getModelFromRef } from 'rhino/utils/models';
import { useModelIndex } from 'rhino/hooks/queries';
import FilterSelectControlled from 'rhino/components/forms/filters/FilterSelectControlled';
import { useModelFilterField, useFilterPill } from 'rhino/hooks/form';

const ModelFilterReference = ({ model, path, ...props }) => {
  const { filter, limit = 100, offset, order, search } = props;
  const { attribute, operator, plainPath } = useModelFilterField(model, path);

  const refModel = useMemo(() => getModelFromRef(attribute), [attribute]);
  const identifier = useMemo(() => getIdentifierAttribute(refModel), [
    refModel
  ]);

  // We need to use an accessor here because the value can an object or the id
  const referenceAccessor = useCallback(
    (value) => value?.[identifier.name] || value || -1,
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

  const { resetPill, setPill } = useFilterPill(fullPath);

  useEffect(() => {
    if (isSuccess && watch) {
      const resource = results.find((r) => `${r[identifier.name]}` === watch);

      setPill(resource?.display_name);
    } else if (!watch) {
      resetPill();
    }
  }, [identifier.name, results, resetPill, setPill, watch, isSuccess]);

  // If there is no order, we sort by display_name
  // This has to be client side because display_name is not a sortable field in the database
  const sortedResults = useMemo(() => {
    if (order) return results;

    return results.sort((a, b) =>
      a?.display_name.localeCompare(b?.display_name, undefined, {
        sensitivity: 'base'
      })
    );
  }, [results, order]);

  return (
    <FilterSelectControlled path={fullPath} accessor={referenceAccessor}>
      {optionsFromIndexWithTitle(sortedResults, `${attribute.readableName}...`)}
    </FilterSelectControlled>
  );
};

ModelFilterReference.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterReference;
