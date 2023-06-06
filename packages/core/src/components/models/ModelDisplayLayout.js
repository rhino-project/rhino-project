import { useGlobalComponent } from 'rhino/hooks/overrides';
import DisplayLayoutVertical from '../forms/DisplayLayoutVertical';

const ModelDisplayLayout = (props) =>
  useGlobalComponent('ModelDisplayLayout', DisplayLayoutVertical, props);

export default ModelDisplayLayout;
