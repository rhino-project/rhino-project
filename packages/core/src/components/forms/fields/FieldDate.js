import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useImperativeHandle, useMemo, useRef } from 'react';
import { useFieldInheritedProps } from '../../../hooks/form';
import { useGlobalComponent } from '../../../hooks/overrides';

export const FieldDateBase = ({ min, max, ...props }) => {
  const { placeholder, path } = props;
  const {
    field: { value, onChange, ref, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  // Workaround for making the input focusable by rhf.
  // Inspired by https://github.com/Hacker0x01/react-datepicker/issues/4834
  const innerRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      innerRef.current?.input?.focus();
    }
  }));

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
      {...fieldProps}
      ref={innerRef}
      wrapperClassName={wrapperClassName}
      selected={date}
      onChange={handleChange}
      dateFormat="MMMM d, yyyy"
      autoComplete="off"
      minDate={min}
      maxDate={max}
      placeholderText={placeholder}
      {...inheritedProps}
    />
  );
};

FieldDateBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldDate = (props) =>
  useGlobalComponent('FieldDate', FieldDateBase, props);
