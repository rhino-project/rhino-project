import PropTypes from 'prop-types';
import FieldYear from 'rhino/components/forms/fields/FieldYear';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const ModelFieldYearBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return <FieldYear isClearable={attribute.nullable} {...props} />;
};

const defaultComponents = { ModelFieldYear: ModelFieldYearBase };

const ModelFieldYear = ({ overrides, ...props }) => {
  const { ModelFieldYear } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldYear {...props} />;
};

ModelFieldYear.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldYear;
