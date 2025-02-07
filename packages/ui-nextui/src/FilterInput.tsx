import { Input, InputProps } from '@heroui/react';

import {
  useController,
  UseControllerProps,
  useFormContext
} from 'react-hook-form';
import React, { useCallback } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type FilterInputProps = InputProps &
  Omit<UseControllerProps, 'name'> & {
    /**
     * The path inside the form object.
     */
    path: string;
  };

export const FilterInputBase: React.FC<FilterInputProps> = ({
  path,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  disabled,
  ...props
}) => {
  const {
    field: { onChange, value, ...fieldProps }
  } = useController({
    name: path,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled
  });
  const { resetField } = useFormContext();

  // FIXME: still needed?
  // const value = useMemo(
  //   () => (accessor ? accessor(fieldValue) : fieldValue),
  //   [accessor, fieldValue]
  // );

  // null is special and means no value (empty) for filtering
  const handleOnChange = useCallback(
    ({ target }) => onChange(target.value === '' ? null : target.value),
    [onChange]
  );

  return (
    <Input
      {...fieldProps}
      isClearable
      // Always keep it as a controlled component
      value={value == null ? '' : value}
      onChange={handleOnChange}
      onClear={() => resetField(path)}
      {...props}
    />
  );
};

export const FilterInput = (props: FilterInputProps) =>
  useGlobalComponent('FilterInput', FilterInputBase, props);
