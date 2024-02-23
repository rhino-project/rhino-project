import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayGroup } from 'rhino/hooks/form';
import DisplayGroupFloat, {
  DisplayGroupFloatingFloat,
  DisplayGroupHorizontalFloat
} from 'rhino/components/forms/displayGroups/DisplayGroupFloat';

export const ModelDisplayGroupVerticalFloat = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloat {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalFloat.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalFloat = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalFloat {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingFloat = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingFloat {...fieldGroupProps} />;
};

const ModelDisplayGroupFloat = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupFloat',
    ModelDisplayGroupVerticalFloat,
    props
  );

export default ModelDisplayGroupFloat;
