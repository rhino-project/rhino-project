import { useMemo } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';
import Header from 'rhino/components/table/Header';

export const ModelHeaderBase = ({ model, path, children, ...props }) => {
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const headerText = useMemo(
    () => children || attribute?.readableName,
    [children, attribute]
  );

  return <Header {...props}>{headerText}</Header>;
};

const ModelHeader = (props) =>
  useGlobalComponent('ModelHeader', ModelHeaderBase, props);

export default ModelHeader;
