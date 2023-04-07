import { useMemo } from 'react';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellCurrency = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    const number = parseFloat(getValue());
    if (isNaN(number)) {
      return empty;
    } else if (number < 0) {
      return `-$${(-1 * number).toFixed(2)}`;
    }
    return `$${number.toFixed(2)}`;
  }, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export default CellCurrency;
