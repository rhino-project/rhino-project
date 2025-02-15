import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFilterField } from '../../../form';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { FilterTime } from '../../../Filter';
import {
  DateFormatter,
  parseAbsoluteToLocal,
  Time
} from '@internationalized/date';

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
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true // Use 12-hour format with AM/PM
};

const buildDateTimePill = (attribute, operator, newValue) => {
  if (!newValue) return null;

  const locale = new Intl.DateTimeFormat().resolvedOptions().locale;
  const formatter = new DateFormatter(locale, FORMAT_OPTIONS);

  const date = parseAbsoluteToLocal(newValue).toDate();

  return `${attribute.readableName} ${operatorToLabel(
    attribute.format,
    operator
  )} ${formatter.format(date)}`;
};

export const ModelFilterTime = ({ path, ...props }) => {
  const { attribute, operator, operatorPath, ...rest } =
    useModelFilterField(path);

  const minValue = useMemo(() => {
    if (!attribute.minimum) return undefined;

    // FIXME how will this get returned from API?
    const date = parseAbsoluteToLocal(attribute.minimum);
    const time = new Time(date.hour, date.minute, date.second);

    // If the minimum is exclusive, we need to add a second to it so the value is not included
    if (attribute.exclusiveMinimum)
      return time.set({ second: date.second + 1 });

    return time;
  }, [attribute]);

  const maxValue = useMemo(() => {
    if (!attribute.maximum) return undefined;

    const date = parseAbsoluteToLocal(attribute.maximum);
    const time = new Time(date.hour, date.minute, date.second);

    // If the maximum is exclusive, we need to subtract a second to it so the value is not included
    if (attribute.exclusiveMaximum)
      return time.set({ second: date.second - 1 });

    return time;
  }, [attribute]);

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch !== undefined && watch !== '')
      setPill(operatorPath, buildDateTimePill(attribute, operator, watch));
  }, [attribute, operator, operatorPath, setPill, watch]);

  return (
    <FilterTime
      path={operatorPath}
      minValue={minValue}
      maxValue={maxValue}
      {...rest}
      {...props}
    />
  );
};

ModelFilterTime.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
