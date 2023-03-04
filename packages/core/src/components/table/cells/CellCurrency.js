import { useMemo } from 'react';

const CellCurrency = ({ getValue, empty = '-' }) => {
  const value = useMemo(() => {
    const number = parseFloat(getValue());
    if (isNaN(number)) {
      return empty;
    } else if (number < 0) {
      return `-$${(-1 * number).toFixed(2)}`;
    }
    return `$${number.toFixed(2)}`;
  }, [empty, getValue]);

  return value;
};

export default CellCurrency;
