import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useController } from 'react-hook-form';
import { Input } from 'reactstrap';
import { useCallback, useMemo, useRef } from 'react';
import { applyCurrencyMask, applyCurrencyMaskFromInput } from 'rhino/utils/ui';

export const FieldCurrency = ({ ...props }) => {
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
