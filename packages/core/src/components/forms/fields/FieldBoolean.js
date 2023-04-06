import PropTypes from 'prop-types';
import { CustomInput } from 'reactstrap';

import { useController } from 'react-hook-form';
import { useFieldInheritedProps } from 'rhino/hooks/form';

const FieldBoolean = (props) => {
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const { readOnly, path } = props;
  const {
    field: { ref, value, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  // FIXME: Cannot guarantee that id will be unique
  return (
    <CustomInput
      {...extractedProps}
      {...fieldProps}
      type="checkbox"
      invalid={!!error}
      checked={value}
      disabled={readOnly}
      {...inheritedProps}
    />
  );
};

FieldBoolean.propTypes = {
  path: PropTypes.string.isRequired
};

export default FieldBoolean;
