import { useMemo } from 'react';
import { Icon } from 'rhino/components/icons';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useTableInheritedProps } from 'rhino/hooks/table';

export const CellBooleanIconBase = ({
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

const CellBooleanIcon = (props) =>
  useGlobalComponent('CellBooleanIcon', CellBooleanIconBase, props);

export default CellBooleanIcon;
