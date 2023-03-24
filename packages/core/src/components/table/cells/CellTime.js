import { useMemo } from 'react';
import { format as dateFormat, parseISO } from 'date-fns';

const CellTime = ({ getValue, format = 'h:mm aa', empty = '-' }) => {
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return dateFormat(parseISO(getValue()), format);
  }, [empty, format, getValue]);

  return value;
};

export default CellTime;
