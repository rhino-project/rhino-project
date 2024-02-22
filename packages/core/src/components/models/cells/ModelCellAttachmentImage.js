import { useCallback, useMemo } from 'react';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellImage from '../../table/cells/CellImage';

export const ModelCellAttachmentImageBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(() => getValue()?.url, [getValue]);

  const altText = useMemo(
    () => getValue()?.display_name || getValue()?.url,
    [getValue]
  );

  return <CellImage alt={altText} getValue={syntheticGetValue} {...props} />;
};

const ModelCellAttachmentImage = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellAttachmentImage',
    ModelCellAttachmentImageBase,
    props
  );

export default ModelCellAttachmentImage;
