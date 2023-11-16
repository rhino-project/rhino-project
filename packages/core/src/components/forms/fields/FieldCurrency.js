import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useController } from 'react-hook-form';
import { Input, InputGroup } from 'reactstrap';
import { useCallback, useMemo, useRef } from 'react';
import { applyCurrencyMask, applyCurrencyMaskFromInput } from 'rhino/utils/ui';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const FieldCurrencyBase = ({ ...props }) => {
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

  // This bug was added in d08e56c. The error is not really passed down to the component
  // as a prop, it comes from the react form hooks. So error was always undefined.
  // FieldCurrency is able to get the error from the hooks and display the feedback.
  return (
    <InputGroup
      className={classnames({
        'is-invalid': error
      })}
    >
      <span className="input-group-text">$</span>
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
    </InputGroup>
  );
};

FieldCurrencyBase.propTypes = {
  path: PropTypes.string.isRequired
};

const FieldCurrency = (props) =>
  useGlobalComponent('FieldCurrency', FieldCurrencyBase, props);

export default FieldCurrency;
