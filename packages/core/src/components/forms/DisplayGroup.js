import { useGlobalOverrides } from 'rhino/hooks/overrides';
import DisplayLayoutVertical from './DisplayLayoutVertical';

const defaultComponents = {
  DisplayLayout: DisplayLayoutVertical
};

export const DisplayGroup = ({ overrides, ...props }) => {
  const { DisplayLayout } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <DisplayLayout {...props} />;
};

export default DisplayGroup;
