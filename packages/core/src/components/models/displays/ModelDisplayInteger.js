import DisplayInteger from 'rhino/components/forms/displays/DisplayInteger';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayIntegerBase = ({ model, ...props }) => (
  <DisplayInteger {...props} />
);

const defaultComponents = { ModelDisplayInteger: ModelDisplayIntegerBase };

const ModelDisplayInteger = ({ overrides, ...props }) => {
  const { ModelDisplayInteger } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayInteger {...props} />;
};

export default ModelDisplayInteger;
