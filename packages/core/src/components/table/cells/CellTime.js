import { useMemo } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';
import { useTableInheritedProps } from '../../../hooks/table';
import { useGlobalComponent } from '../../../hooks/overrides';

export const CellTimeBase = ({ format = 'h:mm aa', empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return dateFormat(parseISO(getValue()), format);
  }, [empty, format, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export const CellTime = (props) =>
  useGlobalComponent('CellTime', CellTimeBase, props);
