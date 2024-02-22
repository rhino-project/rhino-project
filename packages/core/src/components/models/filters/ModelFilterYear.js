import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFilterField } from '../../../hooks/form';
import FilterYear from '../../forms/filters/FilterYear';
import { useModelFiltersContext } from '../../../hooks/controllers';

export const ModelFilterYear = ({ model, path, ...props }) => {
  const { attribute, operatorPath } = useModelFilterField(model, path);

  const min = useMemo(() => {
    if (!attribute.minimum) return undefined;

    return new Date(
      attribute.exclusiveMinimum ? attribute.minimum + 1 : attribute.minimum,
      0,
      1
    );
  }, [attribute]);

  const max = useMemo(() => {
    if (!attribute.maximum) return undefined;

    return new Date(
      attribute.exclusiveMaximum ? attribute.maximum - 1 : attribute.maximum,
      0,
      1
    );
  }, [attribute]);

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch) setPill(operatorPath, watch);
  }, [attribute, operatorPath, setPill, watch]);

  return <FilterYear path={operatorPath} min={min} max={max} {...props} />;
};

ModelFilterYear.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
