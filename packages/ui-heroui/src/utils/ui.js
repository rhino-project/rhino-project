import { format, formatDistance } from 'date-fns';

export const getDateTimeFormat = (attribute) => {
  const dateTimeFormat = {
    datetime: 'MMMM d, yyyy h:mm aa',
    date: 'MMMM d, yyyy',
    time: 'h:mm aa',
    year: 'yyyy'
  };

  return dateTimeFormat[attribute.format];
};

//FIXME update ModelFormFieldDatetime to use this function for datetime format
const getDateTimeDisplayString = (dateTime, type) =>
  dateTime && type === 'date'
    ? new Date(dateTime.replace(/-/g, `/`).replace(/T.+/, ''))
    : dateTime && type !== 'date'
      ? new Date(dateTime)
      : '';

export const getDateTimeLongString = (attribute, value) =>
  format(
    getDateTimeDisplayString(value, attribute.format),
    getDateTimeFormat(attribute)
  );

export const getDateTimeDistanceString = (attribute, value) =>
  formatDistance(new Date(value), new Date(), { addSuffix: true });

export const optionsFromIndex = (
  results,
  labelField = 'display_name',
  valueField = 'id'
) => {
  if (!results) return [];

  return results.map((r) => (
    <option key={r.id} value={`${r[valueField]}`}>
      {r[labelField]}
    </option>
  ));
};

export const optionsFromIndexWithTitle = (
  results,
  title,
  labelField,
  valueField
) => {
  const options = optionsFromIndex(results, labelField, valueField);

  options.push(
    <option key="-1" disabled value={-1}>
      {title}
    </option>
  );

  return options;
};

export const enumFromIndexWithTitle = (enums = [], title) => {
  const options = enums.map((e) => (
    <option key={e} value={e}>
      {e}
    </option>
  ));

  options.push(
    <option key="-1" disabled value={-1}>
      {title}
    </option>
  );

  return options;
};

export const optionsFromNumberRange = (first, last) => {
  return Array.from({ length: last - first + 1 }, (x, i) => (
    <option key={first + i} value={first + i}>
      {first + i}
    </option>
  ));
};

export const optionsFromNumberRangeWithTitle = (first, last, title) => {
  const options = optionsFromNumberRange(first, last);

  options.push(
    <option key="-1" disabled selected value={-1}>
      {title}
    </option>
  );

  return options;
};
