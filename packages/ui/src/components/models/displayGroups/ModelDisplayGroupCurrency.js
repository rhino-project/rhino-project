import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { useModelDisplayGroup } from '@rhino-project/core/hooks';
import {
  DisplayGroupCurrency,
  DisplayGroupFloatingCurrency,
  DisplayGroupHorizontalCurrency
} from '../../forms/displayGroups/DisplayGroupCurrency';

export const ModelDisplayGroupVerticalCurrency = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupCurrency {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalCurrency.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalCurrency = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalCurrency {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingCurrency = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingCurrency {...fieldGroupProps} />;
};

export const ModelDisplayGroupCurrency = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupCurrency',
    ModelDisplayGroupVerticalCurrency,
    props
  );
