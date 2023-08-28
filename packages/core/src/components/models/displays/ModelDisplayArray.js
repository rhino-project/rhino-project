import DisplayArray from 'rhino/components/forms/displays/DisplayArray';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayArrayBase = ({ model, ...props }) => (
  <DisplayArray {...props} />
);

const ModelDisplayArray = (props) =>
  useGlobalComponent('ModelDisplayArray', ModelDisplayArrayBase, props);

export default ModelDisplayArray;
