import { useMemo } from 'react';
import { formatDistance, parseISO } from 'date-fns';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellDateTimeDistance = ({
  empty = '-',
  baseDate = new Date(),
  ...props
}) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return formatDistance(parseISO(getValue()), baseDate, {
      addSuffix: true
    });
  }, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export default CellDateTimeDistance;
