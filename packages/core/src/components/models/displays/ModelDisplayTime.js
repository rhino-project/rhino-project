import DisplayTime from 'rhino/components/forms/displays/DisplayTime';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayTimeBase = ({ model, ...props }) => (
  <DisplayTime {...props} />
);

const ModelDisplayTime = (props) =>
  useGlobalComponent('ModelDisplayTime', ModelDisplayTimeBase, props);

export default ModelDisplayTime;
