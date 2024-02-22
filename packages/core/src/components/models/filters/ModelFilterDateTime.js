import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';
import { format, parseISO } from 'date-fns';

import { useEffect, useMemo } from 'react';
import { useModelFilterField } from '../../../hooks/form';
import FilterDateTime from '../../forms/filters/FilterDateTime';
import { getDateTimeFormat } from '../../../utils/ui';
import { useModelFiltersContext } from '../../../hooks/controllers';

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

const ModelFilterDateTime = ({ model, path, ...props }) => {
  const { attribute, operator, operatorPath } = useModelFilterField(
    model,
    path
  );

  const min = useMemo(() => {
    if (!attribute.minimum) return undefined;

    const date = new Date(attribute.minimum);

    if (attribute.exclusiveMinimum) {
      date.setMilliseconds(date.getMilliseconds() + 1);
    }

    return date;
  }, [attribute]);

  const max = useMemo(() => {
    if (!attribute.maximum) return undefined;

    const date = new Date(attribute.maximum);

    if (attribute.exclusiveMaximum) {
      date.setMilliseconds(date.getMilliseconds() - 1);
    }

    return date;
  }, [attribute]);

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch)
      setPill(operatorPath, buildDateTimePill(attribute, operator, watch));
  }, [attribute, operator, operatorPath, setPill, watch]);

  return <FilterDateTime path={operatorPath} min={min} max={max} {...props} />;
};

ModelFilterDateTime.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterDateTime;
