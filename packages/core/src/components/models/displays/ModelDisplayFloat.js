import DisplayFloat from 'rhino/components/forms/displays/DisplayFloat';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayFloatBase = ({ model, ...props }) => (
  <DisplayFloat {...props} />
);

const ModelDisplayFloat = (props) =>
  useGlobalComponent('ModelDisplayFloat', ModelDisplayFloatBase, props);

export default ModelDisplayFloat;
