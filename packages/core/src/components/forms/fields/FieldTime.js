import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useMemo } from 'react';
import { useFieldInheritedProps } from 'rhino/hooks/form';

const FieldTime = ({ ...props }) => {
  const { path } = props;
  const {
    field: { value, onChange, onBlur },
    fieldState: { error }
  } = useController({
    name: path
  });

  const date = useMemo(() => (value ? new Date(value) : undefined), [value]);

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

  const handleChange = (date) => {
    const dateWithoutMilliseconds = date
      ? new Date(
          2000,
          1,
          1,
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        ).toISOString()
      : null;

    onChange(dateWithoutMilliseconds);
  };

  return (
    <DatePicker
      {...extractedProps}
      wrapperClassName={wrapperClassName}
      selected={date}
      onChange={handleChange}
      // FIXME: On blur does not always work
      onBlur={onBlur}
      dateFormat="h:mm aa"
      showTimeSelect
      showTimeSelectOnly
      {...inheritedProps}
    />
  );
};

FieldTime.propTypes = {
  path: PropTypes.string.isRequired
};

export default FieldTime;
