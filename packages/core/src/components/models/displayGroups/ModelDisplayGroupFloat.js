import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelDisplayGroup } from '../../../hooks/form';
import { DisplayGroupFloat, DisplayGroupFloatingFloat, DisplayGroupHorizontalFloat } from '../../forms/displayGroups/DisplayGroupFloat';

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

export const ModelDisplayGroupFloat = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupFloat',
    ModelDisplayGroupVerticalFloat,
    props
  );
