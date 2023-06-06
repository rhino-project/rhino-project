import DisplayText from 'rhino/components/forms/displays/DisplayText';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayTextBase = ({ model, ...props }) => (
  <DisplayText {...props} />
);

const ModelDisplayText = (props) =>
  useGlobalComponent('ModelDisplayText', ModelDisplayTextBase, props);

export default ModelDisplayText;
