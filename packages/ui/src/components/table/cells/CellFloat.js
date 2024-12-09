import { useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';

const CellFloatBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => getValue() || empty, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export const CellFloat = (props) =>
  useGlobalComponent('CellFloat', CellFloatBase, props);
