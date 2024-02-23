import { useMemo } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';
import { useTableInheritedProps } from '../../../hooks/table';
import { useGlobalComponent } from '../../../hooks/overrides';

export const CellDateTimeBase = ({
  format = 'MMMM d, yyyy h:mm aa',
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

const CellDateTime = (props) =>
  useGlobalComponent('CellDateTime', CellDateTimeBase, props);

export default CellDateTime;
