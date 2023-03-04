import { useMemo } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';

const CellDate = ({ getValue, format = 'MMMM d, yyyy', empty = '-' }) => {
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return dateFormat(parseISO(getValue()), format);
  }, [empty, format, getValue]);

  return value;
};

export default CellDate;
