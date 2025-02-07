import { Input, InputProps } from '@heroui/react';

import { useController, RegisterOptions } from 'react-hook-form';
import { useFieldInheritedProps } from '@rhino-project/core/hooks';
import { useCallback, useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type FieldInputProps = InputProps &
  RegisterOptions & {
    /**
     * The path inside the form object.
     */
    path: string;
  };

export const FieldInputBase: React.FC<FieldInputProps> = ({
  accessor,
  onChangeAccessor,
  ...props
}) => {
  const { path } = props;
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const {
    field: { onChange, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue),
    [accessor, fieldValue]
  );

  const handleOnChange = useCallback(
    ({ target }) => {
      const valueChanged = onChangeAccessor
        ? onChangeAccessor(target.value)
        : target.value;
      onChange(valueChanged);
    },
    [onChange, onChangeAccessor]
  );

  return (
    <Input
      {...extractedProps}
      {...fieldProps}
      autoComplete="off"
      isInvalid={!!error}
      errorMessage={error?.message}
      onChange={handleOnChange}
      value={value || ''}
      {...inheritedProps}
    />
  );
};

export const FieldInput = (props: FieldInputProps) =>
  useGlobalComponent('FieldInput', FieldInputBase, props);
