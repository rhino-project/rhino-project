import DisplayDateTime from 'rhino/components/forms/displays/DisplayDateTime';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayDateTimeBase = ({ model, ...props }) => (
  <DisplayDateTime {...props} />
);

const ModelDisplayDateTime = (props) =>
  useGlobalComponent('ModelDisplayDateTime', ModelDisplayDateTimeBase, props);

export default ModelDisplayDateTime;
