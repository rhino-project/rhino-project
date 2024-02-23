import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useMemo } from 'react';
import { useFieldInheritedProps } from '../../../hooks/form';
import { useGlobalComponent } from '../../../hooks/overrides';

export const FieldDateTimeBase = ({ min, max, ...props }) => {
  const { path, placeholder } = props;
  const {
    field: { value, onChange, ...fieldProps },
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
    // https://github.com/Hacker0x01/react-datepicker/issues/1991
    const dateWithoutMilliseconds = date ? new Date(date) : null;
    dateWithoutMilliseconds?.setUTCMilliseconds(0);

    onChange(dateWithoutMilliseconds?.toISOString() || null);
  };

  return (
    <DatePicker
      {...extractedProps}
      {...fieldProps}
      wrapperClassName={wrapperClassName}
      selected={date}
      onChange={handleChange}
      dateFormat="MMMM d, yyyy h:mm aa"
      autoComplete="off"
      showTimeSelect
      minDate={min}
      maxDate={max}
      placeholderText={placeholder}
      {...inheritedProps}
    />
  );
};

FieldDateTimeBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldDateTime = (props) =>
  useGlobalComponent('FieldDateTime', FieldDateTimeBase, props);
