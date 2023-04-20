import DisplayFloat from 'rhino/components/forms/displays/DisplayFloat';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayFloatBase = ({ model, ...props }) => (
  <DisplayFloat {...props} />
);

const defaultComponents = { ModelDisplayFloat: ModelDisplayFloatBase };

const ModelDisplayFloat = ({ overrides, ...props }) => {
  const { ModelDisplayFloat } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayFloat {...props} />;
};

export default ModelDisplayFloat;
