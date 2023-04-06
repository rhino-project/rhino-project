import PropTypes from 'prop-types';
import FieldDate from 'rhino/components/forms/fields/FieldDate';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const ModelFieldDateBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <FieldDate isClearable={attribute.nullable} {...props} />;
};

const defaultComponents = { ModelFieldDate: ModelFieldDateBase };

const ModelFieldDate = ({ overrides, ...props }) => {
  const { ModelFieldDate } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldDate {...props} />;
};

ModelFieldDate.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldDate;
