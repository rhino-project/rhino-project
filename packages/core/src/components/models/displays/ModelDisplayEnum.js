import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const ModelDisplayEnumBase = ({ model, ...props }) => (
  <DisplayString {...props} />
);

const defaultComponents = { ModelDisplayEnum: ModelDisplayEnumBase };

const ModelDisplayEnum = ({ overrides, ...props }) => {
  const { ModelDisplayEnum } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayEnum {...props} />;
};

export default ModelDisplayEnum;
