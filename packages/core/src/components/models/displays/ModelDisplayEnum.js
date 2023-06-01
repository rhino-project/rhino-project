import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalComponent } from 'rhino/hooks/overrides';

const ModelDisplayEnumBase = ({ model, ...props }) => (
  <DisplayString {...props} />
);

const ModelDisplayEnum = (props) =>
  useGlobalComponent('ModelDisplayEnum', ModelDisplayEnumBase, props);

export default ModelDisplayEnum;
