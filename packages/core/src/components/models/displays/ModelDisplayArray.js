import DisplayArray from 'rhino/components/forms/displays/DisplayArray';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

export const ModelDisplayArrayBase = ({ model, ...props }) => (
  <DisplayArray {...props} />
);

const ModelDisplayArray = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayArray',
    ModelDisplayArrayBase,
    props
  );

export default ModelDisplayArray;
