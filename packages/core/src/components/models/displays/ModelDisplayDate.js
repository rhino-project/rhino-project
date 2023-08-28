import DisplayDate from 'rhino/components/forms/displays/DisplayDate';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayDateBase = ({ model, ...props }) => (
  <DisplayDate {...props} />
);

const ModelDisplayDate = (props) =>
  useGlobalComponent('ModelDisplayDate', ModelDisplayDateBase, props);

export default ModelDisplayDate;
