import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayGroup } from 'rhino/hooks/form';
import DisplayGroupEnum, {
  DisplayGroupFloatingEnum,
  DisplayGroupHorizontalEnum
} from 'rhino/components/forms/displayGroups/DisplayGroupEnum';

export const ModelDisplayGroupVerticalEnum = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupEnum {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalEnum.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalEnum = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalEnum {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingEnum = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingEnum {...fieldGroupProps} />;
};

const ModelDisplayGroupEnum = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupEnum',
    ModelDisplayGroupVerticalEnum,
    props
  );

export default ModelDisplayGroupEnum;
