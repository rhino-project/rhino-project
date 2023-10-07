import { useGlobalComponentForModel } from 'rhino/hooks/overrides';
import DisplayLayoutVertical from '../forms/DisplayLayoutVertical';

const ModelDisplayLayout = (props) =>
  useGlobalComponentForModel(
    'ModelDisplayLayout',
    DisplayLayoutVertical,
    props
  );

export default ModelDisplayLayout;
