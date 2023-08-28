import { useMemo } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellDateTimeRelative = ({
  empty = '-',
  baseDate = new Date(),
  options = {},
  ...props
}) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return formatRelative(parseISO(getValue()), baseDate, options);
  }, [getValue, empty, baseDate, options]);

  return <div {...inheritedProps}>{value}</div>;
};

export default CellDateTimeRelative;
