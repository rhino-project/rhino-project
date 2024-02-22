import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayGroup } from 'rhino/hooks/form';
import DisplayGroupString, {
  DisplayGroupFloatingString,
  DisplayGroupHorizontalString
} from 'rhino/components/forms/displayGroups/DisplayGroupString';

export const ModelDisplayGroupVerticalString = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupString {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalString.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalString = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalString {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingString = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingString {...fieldGroupProps} />;
};

const ModelDisplayGroupString = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupString',
    ModelDisplayGroupVerticalString,
    props
  );

export default ModelDisplayGroupString;
