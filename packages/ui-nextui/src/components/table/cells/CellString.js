import { useTableInheritedProps } from '@rhino-project/core/hooks';
import { useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
export const CellStringBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    return getValue() || empty;
  }, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export const CellString = (props) =>
  useGlobalComponent('CellString', CellStringBase, props);
