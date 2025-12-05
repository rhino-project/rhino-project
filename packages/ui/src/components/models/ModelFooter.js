import { useMemo } from 'react';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { useModelAndAttributeFromPath } from '@rhino-project/core/hooks';
import { Footer } from '../table/Footer';

export const ModelFooterBase = ({ model, path, children, ...props }) => {
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const footerText = useMemo(
    () => children || attribute?.readableName,
    [children, attribute]
  );

  return <Footer {...props}>{footerText}</Footer>;
};

export const ModelFooter = (props) =>
  useGlobalComponentForAttribute('ModelFooter', ModelFooterBase, props);
