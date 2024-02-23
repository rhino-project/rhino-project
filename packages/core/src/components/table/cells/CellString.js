import { useTableInheritedProps } from '../../../hooks/table';
import { useMemo } from 'react';
import { useGlobalComponent } from '../../../hooks/overrides';

export const CellStringBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    return getValue() || empty;
  }, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export const CellString = (props) =>
  useGlobalComponent('CellString', CellStringBase, props);
