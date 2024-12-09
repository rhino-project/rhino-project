import { useMemo } from 'react';
import { Icon } from '../../icons';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';

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

export const CellBooleanIcon = (props) =>
  useGlobalComponent('CellBooleanIcon', CellBooleanIconBase, props);
