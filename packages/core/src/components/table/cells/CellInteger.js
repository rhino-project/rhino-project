import { useMemo } from 'react';
import { useGlobalComponent } from '../../../hooks/overrides';
import { useTableInheritedProps } from '../../../hooks/table';

export const CellIntegerBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => getValue() || empty, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

const CellInteger = (props) =>
  useGlobalComponent('CellInteger', CellIntegerBase, props);

export default CellInteger;
