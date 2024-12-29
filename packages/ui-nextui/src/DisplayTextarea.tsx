import { Textarea, TextAreaProps } from '@heroui/react';

import { useController, RegisterOptions } from 'react-hook-form';
import { useFieldInheritedProps } from '@rhino-project/core/hooks';
import { useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';

export type DisplayTextareaProps = TextAreaProps &
  RegisterOptions & {
    /**
     * The function to format the value before displaying it.
     */
    accessor?: (value: any) => string | null | undefined;
    /**
     * The string to display when the value is empty.
     */
    empty: string;
    /**
     * The path inside the form object.
     */
    path: string;
  };

export const DisplayTextareaBase: React.FC<DisplayTextareaProps> = ({
  accessor,
  empty = '-',
  ...props
}) => {
  const { path } = props;
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const {
    field: { value: fieldValue, ...fieldProps }
  } = useController({
    name: path
  });

  const value = useMemo(
    () => (accessor ? accessor(fieldValue) : fieldValue) ?? empty,
    [accessor, fieldValue, empty]
  );

  return (
    <Textarea
      {...extractedProps}
      {...fieldProps}
      isReadOnly
      autoComplete="off"
      value={value}
      {...inheritedProps}
    />
  );
};

export const DisplayTextarea = (props: DisplayTextareaProps) =>
  useGlobalComponent('DisplayTextarea', DisplayTextareaBase, props);
