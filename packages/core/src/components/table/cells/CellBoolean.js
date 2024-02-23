import { useMemo } from 'react';
import { useGlobalComponent } from '../../../hooks/overrides';
import { useTableInheritedProps } from '../../../hooks/table';

export const CellBooleanBase = ({
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

export const CellBoolean = (props) =>
  useGlobalComponent('CellBoolean', CellBooleanBase, props);
