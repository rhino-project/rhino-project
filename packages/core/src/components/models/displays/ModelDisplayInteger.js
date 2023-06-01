import DisplayInteger from 'rhino/components/forms/displays/DisplayInteger';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayIntegerBase = ({ model, ...props }) => (
  <DisplayInteger {...props} />
);

const ModelDisplayInteger = (props) =>
  useGlobalComponent('ModelDisplayInteger', ModelDisplayIntegerBase, props);

export default ModelDisplayInteger;
