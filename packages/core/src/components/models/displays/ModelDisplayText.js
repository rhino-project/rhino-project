import DisplayText from 'rhino/components/forms/displays/DisplayText';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayTextBase = ({ model, ...props }) => (
  <DisplayText {...props} />
);

const defaultComponents = { ModelDisplayText: ModelDisplayTextBase };

const ModelDisplayText = ({ overrides, ...props }) => {
  const { ModelDisplayText } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayText {...props} />;
};

export default ModelDisplayText;
