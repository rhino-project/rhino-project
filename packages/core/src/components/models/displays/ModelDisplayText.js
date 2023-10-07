import DisplayText from 'rhino/components/forms/displays/DisplayText';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

export const ModelDisplayTextBase = ({ model, ...props }) => (
  <DisplayText {...props} />
);

const ModelDisplayText = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayText',
    ModelDisplayTextBase,
    props
  );

export default ModelDisplayText;
