import { useMemo } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useTableInheritedProps } from 'rhino/hooks/table';

export const CellReferenceBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return getValue().display_name;
  }, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

const CellReference = (props) =>
  useGlobalComponent('CellReference', CellReferenceBase, props);

export default CellReference;
