import { useMemo } from 'react';
import { useGlobalComponent } from '../../../hooks/overrides';
import { useTableInheritedProps } from '../../../hooks/table';

export const CellCurrencyBase = ({ empty = '-', ...props }) => {
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

const CellCurrency = (props) =>
  useGlobalComponent('CellCurrency', CellCurrencyBase, props);

export default CellCurrency;
