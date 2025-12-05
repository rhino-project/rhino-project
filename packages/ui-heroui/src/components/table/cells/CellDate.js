import { useMemo } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';
import { useTableInheritedProps } from '@rhino-project/core/hooks';
import { useGlobalComponent } from '@rhino-project/core/hooks';
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

export const CellDate = (props) =>
  useGlobalComponent('CellDate', CellDateBase, props);
