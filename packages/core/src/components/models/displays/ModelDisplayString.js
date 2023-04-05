import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayStringBase = ({ model, ...props }) => (
  <DisplayString {...props} />
);

const defaultComponents = { ModelDisplayString: ModelDisplayStringBase };

const ModelDisplayString = ({ overrides, ...props }) => {
  const { ModelDisplayString } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayString {...props} />;
};

export default ModelDisplayString;
