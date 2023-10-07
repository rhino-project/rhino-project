import { useGlobalComponentForModel } from 'rhino/hooks/overrides';
import FieldLayoutVertical from '../forms/FieldLayoutVertical';

const ModelFieldLayout = (props) =>
  useGlobalComponentForModel('ModelFieldLayout', FieldLayoutVertical, props);

export default ModelFieldLayout;
