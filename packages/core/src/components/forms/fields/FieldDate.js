import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useMemo } from 'react';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const FieldDateBase = ({ min, max, ...props }) => {
  const { path } = props;
  const {
    field: { value, onChange, onBlur },
    fieldState: { error }
  } = useController({
    name: path
  });

  // The date will be interpreted as UTC unless we break it apart
  const date = useMemo(() => {
    if (!value) return undefined;

    const parts = value.split('-');
    const year = parseInt(parts[0], 10);
    // JavaScript counts months from 0 to 11
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    return new Date(year, month, day);
  }, [value]);

  const inheritedPropsOptions = useMemo(
    () => ({
      className: classnames('d-block', 'form-control', { 'is-invalid': error })
    }),
    [error]
  );
  const wrapperClassName = useMemo(
    () => classnames('d-block', { 'is-invalid': error }),
    [error]
  );
  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    inheritedPropsOptions
  );

  const handleChange = (date) => onChange(date?.toISOString() || null);

  return (
    <DatePicker
      {...extractedProps}
      wrapperClassName={wrapperClassName}
      selected={date}
      onChange={handleChange}
      // FIXME: On blur does not always work
      onBlur={onBlur}
      dateFormat="MMMM d, yyyy"
      autoComplete="off"
      minDate={min}
      maxDate={max}
      {...inheritedProps}
    />
  );
};

FieldDateBase.propTypes = {
  path: PropTypes.string.isRequired
};

const FieldDate = (props) =>
  useGlobalComponent('FieldDate', FieldDateBase, props);

export default FieldDate;
