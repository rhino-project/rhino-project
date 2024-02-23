import { useCallback, useMemo } from 'react';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellLink from '../../table/cells/CellLink';

export const ModelCellAttachmentBase = ({ children, getValue, ...props }) => {
  const syntheticGetValue = useCallback(() => getValue()?.url, [getValue]);
  const linkText = useMemo(
    () => children || getValue()?.display_name,
    [children, getValue]
  );

  return (
    <CellLink getValue={syntheticGetValue} {...props}>
      {linkText}
    </CellLink>
  );
};

export const ModelCellAttachment = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellAttachment',
    ModelCellAttachmentBase,
    props
  );
