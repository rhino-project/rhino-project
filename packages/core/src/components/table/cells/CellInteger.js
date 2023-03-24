import { useMemo } from 'react';

const CellInteger = ({ getValue, empty = '-' }) => {
  const value = useMemo(() => getValue() || empty, [empty, getValue]);

  return value;
};

export default CellInteger;
