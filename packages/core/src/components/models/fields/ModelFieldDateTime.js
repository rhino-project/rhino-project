import PropTypes from 'prop-types';
import FieldDateTime from 'rhino/components/forms/fields/FieldDateTime';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const ModelFieldDateTimeBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <FieldDateTime isClearable={attribute.nullable} {...props} />;
};

const defaultComponents = { ModelFieldDateTime: ModelFieldDateTimeBase };

const ModelFieldDateTime = ({ overrides, ...props }) => {
  const { ModelFieldDateTime } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldDateTime {...props} />;
};

ModelFieldDateTime.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldDateTime;
