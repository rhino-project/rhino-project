import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';
import { format, parseISO } from 'date-fns';

import { useEffect, useMemo } from 'react';
import { useFilterPill, useModelFilterField } from 'rhino/hooks/form';
import FilterDate from '../../forms/filters/FilterDate';
import { getDateTimeFormat } from 'rhino/utils/ui';

// FIXME: Replicated in ModelFilterDate, ModelFilterDateTime, ModelFilterTime
const operatorToLabel = (format, operator) => {
  if (['date', 'time', 'datetime'].includes(format)) {
    switch (operator) {
      case 'diff':
        return 'not';
      case 'gt':
      case 'gteq':
        return 'after';
      case 'lt':
      case 'lteq':
        return 'before';
      default:
        return '';
    }
  } else {
    return '';
  }
};

const buildDateTimePill = (attribute, operator, newValue) => {
  if (!newValue) return null;
  const date = typeof newValue === 'string' ? parseISO(newValue) : newValue;
  return `${attribute.readableName} ${operatorToLabel(
    attribute.format,
    operator
  )} ${format(date, getDateTimeFormat(attribute))}`;
};

const ModelFilterDate = ({ model, path, ...props }) => {
  const { attribute, operator, operatorPath } = useModelFilterField(
    model,
    path
  );

  // FIXME: Exclusive min/max support
  const minDate = useMemo(
    () => (attribute.minimum ? new Date(attribute.minimum) : undefined),
    [attribute]
  );
  const maxYear = useMemo(
    () => (attribute.maximum ? new Date(attribute.maximum) : undefined),
    [attribute]
  );

  const watch = useWatch({ name: operatorPath });

  const { resetPill, setPill } = useFilterPill(operatorPath);

  useEffect(() => {
    if (watch) {
      setPill(buildDateTimePill(attribute, operator, watch));
    } else {
      resetPill();
    }
  }, [attribute, operator, resetPill, setPill, watch]);

  return (
    <FilterDate
      path={operatorPath}
      minDate={minDate}
      maxDate={maxYear}
      {...props}
    />
  );
};

ModelFilterDate.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterDate;
