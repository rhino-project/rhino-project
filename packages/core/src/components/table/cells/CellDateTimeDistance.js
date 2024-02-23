import { useMemo } from 'react';
import { formatDistance, parseISO } from 'date-fns';
import { useTableInheritedProps } from 'rhino/hooks/table';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const CellDateTimeDistanceBase = ({
  baseDate,
  empty = '-',
  ...props
}) => {
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

const CellDateTimeDistance = (props) =>
  useGlobalComponent('CellDateTimeDistance', CellDateTimeDistanceBase, props);

export default CellDateTimeDistance;
