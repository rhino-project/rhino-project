import DisplayLayoutHorizontal from '../forms/DisplayLayoutHorizontal';
import { ModelDisplayGroupBase } from './ModelDisplayGroup';

const overrides = { ModelDisplayLayout: DisplayLayoutHorizontal };

export const ModelDisplayGroupHorizontal = (props) => (
  <ModelDisplayGroupBase overrides={overrides} {...props} />
);

export default ModelDisplayGroupHorizontal;
