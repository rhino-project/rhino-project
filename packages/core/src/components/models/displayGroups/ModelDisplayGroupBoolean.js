import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayGroup } from 'rhino/hooks/form';
import DisplayGroupBoolean, {
  DisplayGroupFloatingBoolean,
  DisplayGroupHorizontalBoolean
} from 'rhino/components/forms/displayGroups/DisplayGroupBoolean';

export const ModelDisplayGroupVerticalBoolean = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupBoolean {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalBoolean.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalBoolean = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalBoolean {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingBoolean = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingBoolean {...fieldGroupProps} />;
};

const ModelDisplayGroupBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupBoolean',
    ModelDisplayGroupVerticalBoolean,
    props
  );

export default ModelDisplayGroupBoolean;
