import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import classnames from 'classnames';

import { useController } from 'react-hook-form';
import { useImperativeHandle, useMemo, useRef } from 'react';
import { useFieldInheritedProps } from '../../../hooks/form';
import { useGlobalComponent } from '../../../hooks/overrides';

export const FieldTimeBase = ({ ...props }) => {
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
      {...fieldProps}
      ref={innerRef}
      wrapperClassName={wrapperClassName}
      selected={date}
      onChange={handleChange}
      dateFormat="h:mm aa"
      showTimeSelect
      showTimeSelectOnly
      placeholderText={placeholder}
      {...inheritedProps}
    />
  );
};

FieldTimeBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldTime = (props) =>
  useGlobalComponent('FieldTime', FieldTimeBase, props);
