import { useCallback, useMemo } from 'react';
import { useTableInheritedProps } from '../../../hooks/table';
import { CellLink } from './CellLink';
import { useGlobalComponent } from '../../../hooks/overrides';

export const CellLinkTelephoneBase = ({ children, empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const syntheticGetValue = useCallback(
    () => `tel:${getValue()?.replace(/\D/g, '')}`,
    [getValue]
  );
  const linkText = useMemo(() => children || getValue(), [children, getValue]);

  if (!getValue()) {
    return <div {...inheritedProps}>{empty}</div>;
  }

  return (
    <CellLink {...props} getValue={syntheticGetValue}>
      {linkText}
    </CellLink>
  );
};

export const CellLinkTelephone = (props) =>
  useGlobalComponent('CellLinkTelephone', CellLinkTelephoneBase, props);
