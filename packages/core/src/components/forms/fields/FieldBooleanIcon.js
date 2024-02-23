import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { useFieldInheritedProps } from '../../../hooks/form';
import { Icon } from '../../icons';
import { useGlobalComponent } from '../../../hooks/overrides';

export const FieldBooleanIconBase = ({
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

FieldBooleanIconBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldBooleanIcon = (props) =>
  useGlobalComponent('FieldBooleanIcon', FieldBooleanIconBase, props);
