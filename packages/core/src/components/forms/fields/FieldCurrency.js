import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useFieldError, useFieldInheritedProps } from '../../../hooks/form';
import { useController } from 'react-hook-form';
import { Input, InputGroup } from 'reactstrap';
import { useCallback, useMemo, useRef } from 'react';
import { applyCurrencyMask, applyCurrencyMaskFromInput } from '../../../utils/ui';
import { useGlobalComponent } from '../../../hooks/overrides';

export const FieldCurrencyBaseInput = ({ ...props }) => {
  const { path } = props;
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const inputRef = useRef(null);
  const {
    field: { onChange, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const handleOnChange = useCallback((event) => {
    const formattedValue = applyCurrencyMaskFromInput(event);
    if (inputRef.current) {
      inputRef.current.value = formattedValue.value;
      inputRef.current.setSelectionRange(
        formattedValue.selectionStart,
        formattedValue.selectionEnd
      );
    }
  }, []);

  const handleOnBlur = useCallback(() => {
    const value = applyCurrencyMask(inputRef.current?.value);
    onChange(value);
    if (inputRef.current) inputRef.current.value = value;
  }, [onChange]);

  const value = useMemo(() => applyCurrencyMask(fieldValue), [fieldValue]);

  return (
    <Input
      {...extractedProps}
      {...fieldProps}
      defaultValue={value}
      autoComplete="off"
      innerRef={inputRef}
      invalid={!!error}
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      {...inheritedProps}
    />
  );
};

export const FieldCurrencyBase = ({ ...props }) => {
  const { path } = props;
  const error = useFieldError(path);

  return (
    <InputGroup
      className={classnames({
        'is-invalid': error
      })}
    >
      <span className="input-group-text">$</span>
      <FieldCurrencyBaseInput {...props} />
    </InputGroup>
  );
};

FieldCurrencyBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldCurrency = (props) =>
  useGlobalComponent('FieldCurrency', FieldCurrencyBase, props);
