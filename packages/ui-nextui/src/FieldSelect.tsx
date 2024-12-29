import { Select, SelectProps } from '@heroui/react';
import { useController, RegisterOptions } from 'react-hook-form';
import { useFieldInheritedProps } from '@rhino-project/core/hooks';
import React, { useCallback, useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type FieldSelectProps = SelectProps &
  RegisterOptions & {
    /**
     * The path inside the form object.
     */
    path: string;
  };

export const FieldSelectBase: React.FC<FieldSelectProps> = ({
  accessor,
  children,
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
        : target.value === ''
          ? null
          : target.value;
      onChange(valueChanged);
    },
    [onChange, onChangeAccessor]
  );

  return (
    <Select
      {...extractedProps}
      {...fieldProps}
      isInvalid={!!error}
      errorMessage={error?.message}
      onChange={handleOnChange}
      selectedKeys={value ? [value] : []}
      {...inheritedProps}
    >
      {children}
    </Select>
  );
};

export const FieldSelect = (props: FieldSelectProps) =>
  useGlobalComponent('FieldSelect', FieldSelectBase, props);
