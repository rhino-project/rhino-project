import { useGlobalComponent, useMergedOverrides } from 'rhino/hooks/overrides';
import FieldLayoutVertical from '../FieldLayoutVertical';
import FieldFile from '../fields/FieldFile';
import FieldLayoutHorizontal from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldFile
};

export const FieldGroupFileBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalFile = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

const FieldGroupFloatingFile = FieldGroupFileBase;
export { FieldGroupFloatingFile };

const FieldGroupFile = (props) =>
  useGlobalComponent('FieldGroupFile', FieldGroupFileBase, props);

export default FieldGroupFile;
