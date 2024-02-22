import { useMemo } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';
import { useTableInheritedProps } from '../../../hooks/table';
import { useGlobalComponent } from '../../../hooks/overrides';

export const CellDateBase = ({
  format = 'MMMM d, yyyy',
  empty = '-',
  ...props
}) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return dateFormat(parseISO(getValue()), format);
  }, [empty, format, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

const CellDate = (props) => useGlobalComponent('CellDate', CellDateBase, props);

export default CellDate;
