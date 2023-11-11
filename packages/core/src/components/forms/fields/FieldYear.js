import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useMemo } from 'react';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const FieldYearBase = ({ min, max, ...props }) => {
  const { path } = props;
  const {
    field: { value, onChange, onBlur },
    fieldState: { error }
  } = useController({
    name: path
  });

  const year = useMemo(
    () => (value ? new Date(value, 0, 1) : undefined),
    [value]
  );

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

  const handleChange = (date) => onChange(date?.getFullYear() || null);

  return (
    <DatePicker
      {...extractedProps}
      wrapperClassName={wrapperClassName}
      selected={year}
      onChange={handleChange}
      // FIXME: On blur does not always work
      onBlur={onBlur}
      showYearPicker
      dateFormat="yyyy"
      autoComplete="off"
      minDate={min}
      maxDate={max}
      {...inheritedProps}
    />
  );
};

FieldYearBase.propTypes = {
  path: PropTypes.string.isRequired
};

const FieldYear = (props) =>
  useGlobalComponent('FieldYear', FieldYearBase, props);

export default FieldYear;
