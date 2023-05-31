import { useGlobalComponent } from 'rhino/hooks/overrides';
import FieldLayoutVertical from '../forms/FieldLayoutVertical';

const ModelFieldLayout = (props) =>
  useGlobalComponent('ModelFieldLayout', FieldLayoutVertical, props);

export default ModelFieldLayout;
