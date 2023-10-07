import PropTypes from 'prop-types';
import FieldDateTime from 'rhino/components/forms/fields/FieldDateTime';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const ModelFieldDateTimeBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <FieldDateTime isClearable={attribute.nullable} {...props} />;
};

ModelFieldDateTimeBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldDateTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldDateTime',
    ModelFieldDateTimeBase,
    props
  );

export default ModelFieldDateTime;
