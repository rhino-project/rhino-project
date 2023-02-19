import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useMemo } from 'react';
import { useFieldInheritedProps } from 'rhino/hooks/form';

const FieldYear = ({ ...props }) => {
  const { path } = props;
  const {
    field: { value, onChange, onBlur },
    fieldState: { error }
  } = useController({
    name: path
  });

  const year = useMemo(() => (value ? new Date(value, 1, 1) : undefined), [
    value
  ]);

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
      {...inheritedProps}
    />
  );
};

FieldYear.propTypes = {
  path: PropTypes.string.isRequired
};

export default FieldYear;
