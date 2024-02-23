import { useMemo } from 'react';
import { useGlobalComponentForAttribute } from '../../hooks/overrides';
import { useModelAndAttributeFromPath } from '../../hooks/models';
import Header from '../table/Header';

export const ModelHeaderBase = ({ model, path, children, ...props }) => {
  const { attribute } = useModelAndAttributeFromPath(model, path);
  const headerText = useMemo(
    () => children || attribute?.readableName,
    [children, attribute]
  );

  return <Header {...props}>{headerText}</Header>;
};

export const ModelHeader = (props) =>
  useGlobalComponentForAttribute('ModelHeader', ModelHeaderBase, props);
