import { useMemo } from 'react';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import Footer from 'rhino/components/table/Footer';

export const ModelFooterBase = ({ model, path, children, ...props }) => {
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const footerText = useMemo(
    () => children || attribute?.readableName,
    [children, attribute]
  );

  return <Footer {...props}>{footerText}</Footer>;
};

const ModelFooter = (props) =>
  useGlobalComponentForAttribute('ModelFooter', ModelFooterBase, props);

export default ModelFooter;
