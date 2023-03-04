import { useMemo } from 'react';

const CellReference = ({ getValue, empty = '-', ...props }) => {
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return getValue().display_name;
  }, [empty, getValue]);

  return value;
};

export default CellReference;
