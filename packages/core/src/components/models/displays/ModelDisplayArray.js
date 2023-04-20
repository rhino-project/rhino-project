import DisplayArray from 'rhino/components/forms/displays/DisplayArray';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayArrayBase = ({ model, ...props }) => (
  <DisplayArray {...props} />
);

const defaultComponents = { ModelDisplayArray: ModelDisplayArrayBase };

const ModelDisplayArray = ({ overrides, ...props }) => {
  const { ModelDisplayArray } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayArray {...props} />;
};

export default ModelDisplayArray;
