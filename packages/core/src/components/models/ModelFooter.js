import { useMemo } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import Footer from 'rhino/components/table/Footer';

export const ModelFooterBase = ({ model, path, children, ...props }) => {
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const footerText = useMemo(() => children || attribute?.readableName, [
    children,
    attribute
  ]);

  return <Footer {...props}>{footerText}</Footer>;
};

const defaultComponents = { ModelFooter: ModelFooterBase };

const ModelFooter = ({ overrides, ...props }) => {
  const { ModelFooter } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFooter {...props} />;
};

export default ModelFooter;
