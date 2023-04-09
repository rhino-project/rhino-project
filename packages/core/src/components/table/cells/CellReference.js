import { useMemo } from 'react';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellReference = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return getValue().display_name;
  }, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export default CellReference;
