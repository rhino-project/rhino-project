import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { enumFromIndexWithTitle } from '../../../utils/ui';
import { useCallback, useEffect, useMemo } from 'react';
import { FilterSelectControlled } from '../../forms/filters/FilterSelectControlled';
import { useModelFilterField } from '../../../hooks/form';
import { useModelFiltersContext } from '../../../hooks/controllers';

export const ModelFilterEnum = ({ model, path, ...props }) => {
  const { attribute, operatorPath } = useModelFilterField(model, path);

  const options = useMemo(
    () =>
      enumFromIndexWithTitle(attribute?.enum, `${attribute.readableName}...`),
    [attribute]
  );

  // When the value is nullish, we want to set the value to -1 which is the title
  const accessor = useCallback((value) => value || -1, []);

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch) setPill(operatorPath, watch);
  }, [operatorPath, setPill, watch]);

  return (
    <FilterSelectControlled path={operatorPath} accessor={accessor} {...props}>
      {options}
    </FilterSelectControlled>
  );
};

ModelFilterEnum.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
