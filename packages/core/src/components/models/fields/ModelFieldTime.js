import PropTypes from 'prop-types';
import FieldTime from 'rhino/components/forms/fields/FieldTime';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const ModelFieldTimeBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <FieldTime isClearable={attribute.nullable} {...props} />;
};

const defaultComponents = { ModelFieldTime: ModelFieldTimeBase };

const ModelFieldTime = ({ overrides, ...props }) => {
  const { ModelFieldTime } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldTime {...props} />;
};

ModelFieldTime.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldTime;
