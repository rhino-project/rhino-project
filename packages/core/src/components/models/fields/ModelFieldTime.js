import PropTypes from 'prop-types';
import FieldTime from 'rhino/components/forms/fields/FieldTime';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const ModelFieldTimeBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <FieldTime isClearable={attribute.nullable} {...props} />;
};

ModelFieldTimeBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldTime = (props) =>
  useGlobalComponentForAttribute('ModelFieldTime', ModelFieldTimeBase, props);

export default ModelFieldTime;
