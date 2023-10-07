import PropTypes from 'prop-types';
import FieldYear from 'rhino/components/forms/fields/FieldYear';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const ModelFieldYearBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <FieldYear isClearable={attribute.nullable} {...props} />;
};

ModelFieldYearBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldYear = (props) =>
  useGlobalComponentForAttribute('ModelFieldYear', ModelFieldYearBase, props);

export default ModelFieldYear;
