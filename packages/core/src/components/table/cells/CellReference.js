import { useMemo } from 'react';
import { useGlobalComponent } from '../../../hooks/overrides';
import { useTableInheritedProps } from '../../../hooks/table';

export const CellReferenceBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return getValue().display_name;
  }, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export const CellReference = (props) =>
  useGlobalComponent('CellReference', CellReferenceBase, props);
