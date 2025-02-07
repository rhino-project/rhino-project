import { useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';
import { Icon } from '@iconify/react';

export const CellBooleanIconBase = ({
  trueIcon = 'bi:check',
  falseIcon = 'bi:x',
  empty = 'bi:dash',
  ...props
}) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (getValue() == null) return empty;
    return getValue() ? trueIcon : falseIcon;
  }, [empty, getValue, trueIcon, falseIcon]);

  return <Icon className="w-8" icon={value} {...inheritedProps} />;
};

export const CellBooleanIcon = (props) =>
  useGlobalComponent('CellBooleanIcon', CellBooleanIconBase, props);
