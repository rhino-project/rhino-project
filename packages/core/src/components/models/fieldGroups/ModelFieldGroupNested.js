import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelFieldGroup } from '../../../hooks/form';
import { ModelFieldNested } from '../fields/ModelFieldNested';
import { FieldLayoutVertical } from '../../forms/FieldLayoutVertical';

const BASE_OVERRIDES = {
  Field: ModelFieldNested
};

export const ModelFieldGroupNestedVertical = (props) => {
  const { model, fieldGroupProps } = useModelFieldGroup(props);
  // FIXME: Merged overrides?

  // Use FieldLayoutVertical to always force vertical layout, floating doesn't make sense
  return (
    <FieldLayoutVertical
      overrides={BASE_OVERRIDES}
      // FIXME: Hack for ModelFieldNested to find everything
      model={model}
      {...fieldGroupProps}
    />
  );
};

ModelFieldGroupNestedVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupNested = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupNested',
    ModelFieldGroupNestedVertical,
    props
  );
