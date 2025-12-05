import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useModelFilterField } from '../../../form';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { FilterDate } from '../../../Filter';
import { DateFormatter, parseDate } from '@internationalized/date';

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

const FORMAT_OPTIONS = {
  month: 'short', // Short month name (e.g., Feb)
  day: 'numeric', // Numeric day (e.g., 4)
  year: 'numeric' // Numeric year (e.g., 2025)
};

const buildDateTimePill = (attribute, operator, newValue) => {
  if (!newValue) return null;

  const locale = new Intl.DateTimeFormat().resolvedOptions().locale;
  const formatter = new DateFormatter(locale, FORMAT_OPTIONS);

  const date = parseDate(newValue).toDate();

  return `${attribute.readableName} ${operatorToLabel(
    attribute.format,
    operator
  )} ${formatter.format(date)}`;
};

export const ModelFilterDate = ({ path, ...props }) => {
  const { attribute, operator, operatorPath, ...rest } =
    useModelFilterField(path);

  const minValue = useMemo(() => {
    if (!attribute.minimum) return undefined;

    const date = parseDate(attribute.minimum);

    // If the minimum is exclusive, we need to add a day to it so the value is not included
    if (attribute.exclusiveMinimum) return date.add({ days: 1 });

    return date;
  }, [attribute]);

  const maxValue = useMemo(() => {
    if (!attribute.maximum) return undefined;

    const date = parseDate(attribute.maximum);

    // If the maximum is exclusive, we need to subtract a millisecond to it so the value is not included
    if (attribute.exclusiveMaximum) return date.subtract({ days: 1 });

    return date;
  }, [attribute]);

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch !== undefined && watch !== '')
      setPill(operatorPath, buildDateTimePill(attribute, operator, watch));
  }, [attribute, operator, operatorPath, setPill, watch]);

  return (
    <FilterDate
      path={operatorPath}
      granularity="day"
      parse={parseDate}
      minValue={minValue}
      maxValue={maxValue}
      {...rest}
      {...props}
    />
  );
};

ModelFilterDate.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
