import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayStringBase = ({ model, ...props }) => (
  <DisplayString {...props} />
);

const ModelDisplayString = (props) =>
  useGlobalComponent('ModelDisplayString', ModelDisplayStringBase, props);

export default ModelDisplayString;
