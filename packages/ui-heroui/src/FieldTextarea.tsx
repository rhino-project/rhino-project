import { useCallback, useMemo } from 'react';
import { Textarea, TextAreaProps } from '@heroui/react';
import { useController, RegisterOptions } from 'react-hook-form';
import { useFieldInheritedProps } from '@rhino-project/core/hooks';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type FieldTextareaProps = TextAreaProps &
  RegisterOptions & {
    /**
     * The path inside the form object.
     */
    path: string;
  };

export const FieldTextareaBase: React.FC<FieldTextareaProps> = ({
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
    <Textarea
      {...extractedProps}
      {...fieldProps}
      autoComplete="off"
      isInvalid={!!error}
      errorMessage={error?.message}
      onChange={handleOnChange}
      value={value}
      {...inheritedProps}
    />
  );
};

export const FieldTextarea = (props: FieldTextareaProps) =>
  useGlobalComponent('FieldTextarea', FieldTextareaBase, props);
