import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import { useController } from 'react-hook-form';
import { useMemo } from 'react';
import { useFieldInheritedProps } from 'rhino/hooks/form';

const FieldInputControlled = ({ accessor, ...props }) => {
  const { path } = props;
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const {
    field: { ref, value: fieldValue, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const value = useMemo(() => (accessor ? accessor(fieldValue) : fieldValue), [
    accessor,
    fieldValue
  ]);

  return (
    <Input
      {...extractedProps}
      {...fieldProps}
      autoComplete="off"
      innerRef={ref}
      invalid={!!error}
      value={value}
      {...inheritedProps}
    />
  );
};

FieldInputControlled.propTypes = {
  accessor: PropTypes.func,
  path: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default FieldInputControlled;
