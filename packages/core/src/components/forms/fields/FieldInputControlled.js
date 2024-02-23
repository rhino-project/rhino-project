import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import { useController } from 'react-hook-form';
import { useFieldInheritedProps } from '../../../hooks/form';
import { useCallback, useMemo } from 'react';
import { useGlobalComponent } from '../../../hooks/overrides';

export const FieldInputControlledBase = ({
  accessor,
  onChangeAccessor,
  ...props
}) => {
  const { path } = props;
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const {
    field: { ref, onChange, value: fieldValue, ...fieldProps },
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
      innerRef={ref}
      invalid={!!error}
      onChange={handleOnChange}
      value={value}
      {...inheritedProps}
    />
  );
};

FieldInputControlledBase.propTypes = {
  accessor: PropTypes.func,
  path: PropTypes.string.isRequired,
  type: PropTypes.string
};

export const FieldInputControlled = (props) =>
  useGlobalComponent('FieldInputControlled', FieldInputControlledBase, props);
