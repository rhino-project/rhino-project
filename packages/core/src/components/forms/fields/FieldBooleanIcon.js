import PropTypes from 'prop-types';

import { useController } from 'react-hook-form';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { Icon } from 'rhino/components/icons';

const FieldBooleanIcon = ({
  trueIcon = 'check',
  falseIcon = 'x',
  ...props
}) => {
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const { path } = props;
  const {
    field: { value, onChange, ...fieldProps }
  } = useController({
    name: path
  });

  return (
    <Icon
      {...extractedProps}
      icon={value ? trueIcon : falseIcon}
      onClick={() => onChange(!value)}
      {...fieldProps}
      {...inheritedProps}
    />
  );
};

FieldBooleanIcon.propTypes = {
  path: PropTypes.string.isRequired
};

export default FieldBooleanIcon;
