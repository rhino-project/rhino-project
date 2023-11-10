import { useMemo } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellFloatBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => getValue() || empty, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

const CellFloat = (props) =>
  useGlobalComponent('CellFloat', CellFloatBase, props);

export default CellFloat;
