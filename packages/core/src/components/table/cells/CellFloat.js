import { useMemo } from 'react';

const CellFloat = ({ getValue, empty = '-' }) => {
  const value = useMemo(() => getValue() || empty, [empty, getValue]);

  return value;
};

export default CellFloat;
