import { useCallback } from 'react';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { CellString } from '../../table/cells/CellString';

export const ModelCellAttachmentsBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(
    () => (getValue()?.length ? `${getValue()?.length} files` : undefined),
    [getValue]
  );

  return <CellString getValue={syntheticGetValue} {...props} />;
};

export const ModelCellAttachments = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellAttachments',
    ModelCellAttachmentsBase,
    props
  );
