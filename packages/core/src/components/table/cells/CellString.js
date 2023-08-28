import { useTableInheritedProps } from 'rhino/hooks/table';
import { useMemo } from 'react';

const CellString = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    return getValue() || empty;
  }, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export default CellString;
