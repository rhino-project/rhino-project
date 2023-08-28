import { useMemo } from 'react';
import { Icon } from 'rhino/components/icons';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellBooleanIcon = ({
  trueIcon = 'check',
  falseIcon = 'x',
  empty = 'dash',
  ...props
}) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (getValue() == null) return empty;
    return getValue() ? trueIcon : falseIcon;
  }, [empty, getValue, trueIcon, falseIcon]);

  return <Icon icon={value} {...inheritedProps} />;
};

export default CellBooleanIcon;
