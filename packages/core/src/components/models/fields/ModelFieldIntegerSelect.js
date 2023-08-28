import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useController } from 'react-hook-form';
import { Input } from 'reactstrap';
import classnames from 'classnames';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import { optionsFromIndexWithTitle } from 'rhino/utils/ui';

export const ModelFieldIntegerSelectBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const {
    field: { value, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  const integers = useMemo(
    () =>
      Array.from({ length: attribute.maximum - attribute.minimum }, (x, i) => ({
        id: i + attribute.minimum,
        display_name: `${i + attribute.minimum}`
      })),
    [attribute]
  );

  return (
    <Input
      type="select"
      value={value || -1}
      {...fieldProps}
      className={classnames({ 'is-invalid': error })}
      isInvalid={!!error}
      {...props}
    >
      {optionsFromIndexWithTitle(integers, `${attribute.readableName}...`)}
    </Input>
  );
};

ModelFieldIntegerSelectBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldIntegerSelect = (props) =>
  useGlobalComponent(
    'ModelFieldIntegerSelect',
    ModelFieldIntegerSelectBase,
    props
  );

export default ModelFieldIntegerSelect;
