import { useMemo } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import { useTableInheritedProps } from '@rhino-project/core/hooks';
import { useGlobalComponent } from '@rhino-project/core/hooks';
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

export const CellDateTimeRelative = (props) =>
  useGlobalComponent('CellDateTimeRelative', CellDateTimeRelativeBase, props);
