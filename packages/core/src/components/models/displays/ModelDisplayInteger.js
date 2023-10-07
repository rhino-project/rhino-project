import DisplayInteger from 'rhino/components/forms/displays/DisplayInteger';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

export const ModelDisplayIntegerBase = ({ model, ...props }) => (
  <DisplayInteger {...props} />
);

const ModelDisplayInteger = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayInteger',
    ModelDisplayIntegerBase,
    props
  );

export default ModelDisplayInteger;
