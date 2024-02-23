import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayGroup } from 'rhino/hooks/form';
import DisplayGroupText, {
  DisplayGroupFloatingText,
  DisplayGroupHorizontalText
} from 'rhino/components/forms/displayGroups/DisplayGroupText';

export const ModelDisplayGroupVerticalText = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupText {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalText.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalText = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalText {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingText = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingText {...fieldGroupProps} />;
};

const ModelDisplayGroupText = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupText',
    ModelDisplayGroupVerticalText,
    props
  );

export default ModelDisplayGroupText;
