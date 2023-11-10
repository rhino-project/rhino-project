import { useMemo } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import { useTableInheritedProps } from 'rhino/hooks/table';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const CellDateTimeRelativeBase = ({
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

const CellDateTimeRelative = (props) =>
  useGlobalComponent('CellDateTimeRelative', CellDateTimeRelativeBase, props);

export default CellDateTimeRelative;
