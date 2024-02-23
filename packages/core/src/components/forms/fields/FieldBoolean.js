import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { useController } from 'react-hook-form';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const FieldBooleanBase = (props) => {
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
    <Input
      {...extractedProps}
      {...fieldProps}
      innerRef={ref}
      type="checkbox"
      invalid={!!error}
      checked={value}
      disabled={readOnly}
      {...inheritedProps}
    />
  );
};

FieldBooleanBase.propTypes = {
  path: PropTypes.string.isRequired
};

const FieldBoolean = (props) =>
  useGlobalComponent('FieldBoolean', FieldBooleanBase, props);

export default FieldBoolean;
