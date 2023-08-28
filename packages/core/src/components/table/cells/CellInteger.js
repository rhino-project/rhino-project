import { useMemo } from 'react';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellInteger = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => getValue() || empty, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export default CellInteger;
