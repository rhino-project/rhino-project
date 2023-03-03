import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFilterField, useFilterPill } from 'rhino/hooks/form';
import FilterYear from '../../forms/filters/FilterYear';

const ModelFilterYear = (props) => {
  const { model, path } = props;
  const { attribute, operatorPath } = useModelFilterField(model, path);

  // FIXME: Exclusive min/max support
  const minYear = useMemo(
    () => (attribute.minimum ? new Date(attribute.minimum, 1, 1) : undefined),
    [attribute]
  );
  const maxYear = useMemo(
    () => (attribute.maximum ? new Date(attribute.maximum, 1, 1) : undefined),
    [attribute]
  );

  const watch = useWatch({ name: operatorPath });

  const { resetPill, setPill } = useFilterPill(operatorPath);

  useEffect(() => {
    if (watch) {
      setPill(watch);
    } else {
      resetPill();
    }
  }, [attribute, resetPill, setPill, watch]);

  return <FilterYear path={operatorPath} minDate={minYear} maxDate={maxYear} />;
};

ModelFilterYear.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterYear;
