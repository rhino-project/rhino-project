import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useImperativeHandle, useMemo, useRef } from 'react';
import { useFieldInheritedProps } from '../../../hooks/form';
import { useGlobalComponent } from '../../../hooks/overrides';

export const FieldYearBase = ({ min, max, ...props }) => {
  const { path, placeholder } = props;
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
      {...fieldProps}
      ref={innerRef}
      wrapperClassName={wrapperClassName}
      selected={year}
      onChange={handleChange}
      showYearPicker
      dateFormat="yyyy"
      autoComplete="off"
      minDate={min}
      maxDate={max}
      placeholderText={placeholder}
      {...inheritedProps}
    />
  );
};

FieldYearBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldYear = (props) =>
  useGlobalComponent('FieldYear', FieldYearBase, props);
