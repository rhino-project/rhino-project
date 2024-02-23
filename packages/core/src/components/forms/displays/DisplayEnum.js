import { useGlobalComponent } from '../../../hooks/overrides';
import { DisplayStringBase } from './DisplayString';

export const DisplayEnumBase = (props) => {
  return <DisplayStringBase {...props} />;
};

export const DisplayEnum = (props) =>
  useGlobalComponent('DisplayEnum', DisplayEnumBase, props);
