import { useMemo } from 'react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';

export const CellReferenceBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const value = useMemo(() => {
    if (!getValue()) return empty;

    return getValue().display_name;
  }, [empty, getValue]);

  return <div {...inheritedProps}>{value}</div>;
};

export const CellReference = (props) =>
  useGlobalComponent('CellReference', CellReferenceBase, props);
