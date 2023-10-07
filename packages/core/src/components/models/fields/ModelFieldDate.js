import PropTypes from 'prop-types';
import FieldDate from 'rhino/components/forms/fields/FieldDate';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const ModelFieldDateBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <FieldDate isClearable={attribute.nullable} {...props} />;
};

ModelFieldDateBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldDate = (props) =>
  useGlobalComponentForAttribute('ModelFieldDate', ModelFieldDateBase, props);

export default ModelFieldDate;
