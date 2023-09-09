import { useMemo } from 'react';
import { formatDistance, parseISO } from 'date-fns';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellDateTimeDistance = ({ baseDate, empty = '-', ...props }) => {
  const computedBaseDate = useMemo(() => baseDate || new Date(), [baseDate]);
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return formatDistance(parseISO(getValue()), computedBaseDate, {
      addSuffix: true
    });
  }, [computedBaseDate, empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export default CellDateTimeDistance;
