import { useMemo } from 'react';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellBoolean = ({
  trueText = 'Yes',
  falseText = 'No',
  empty = '-',
  ...props
}) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (getValue() == null) return empty;

    return getValue() ? trueText : falseText;
  }, [empty, getValue, trueText, falseText]);

  return <div {...inheritedProps}>{value}</div>;
};

export default CellBoolean;
