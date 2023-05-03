import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useController } from 'react-hook-form';
import { CustomInput } from 'reactstrap';
import classnames from 'classnames';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
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
    <CustomInput
      type="select"
      value={value || -1}
      {...fieldProps}
      className={classnames({ 'is-invalid': error })}
      isInvalid={!!error}
      {...props}
    >
      {optionsFromIndexWithTitle(integers, `${attribute.readableName}...`)}
    </CustomInput>
  );
};

const defaultComponents = {
  ModelFieldIntegerSelect: ModelFieldIntegerSelectBase
};

const ModelFieldIntegerSelect = ({ overrides, ...props }) => {
  const { ModelFieldIntegerSelect } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldIntegerSelect {...props} />;
};

ModelFieldIntegerSelect.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldIntegerSelect;
