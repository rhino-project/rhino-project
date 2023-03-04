import { useMemo } from 'react';

const CellBoolean = ({
  getValue,
  trueText = 'Yes',
  falseText = 'No',
  empty = '-'
}) => {
  const value = useMemo(() => {
    if (getValue() == null) return empty;

    return getValue() ? trueText : falseText;
  }, [empty, getValue, trueText, falseText]);

  return value;
};

export default CellBoolean;
