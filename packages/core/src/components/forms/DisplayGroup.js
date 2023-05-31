import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
import DisplayLayoutVertical from './DisplayLayoutVertical';

const defaultComponents = {
  DisplayLayout: DisplayLayoutVertical
};

export const DisplayGroupBase = ({ overrides, ...props }) => {
  const { DisplayLayout } = useOverrides(defaultComponents, overrides);

  return <DisplayLayout {...props} />;
};

const DisplayGroup = (props) =>
  useGlobalComponent('DisplayGroup', DisplayGroupBase, props);

export default DisplayGroup;
