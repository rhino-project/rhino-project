import { useGlobalComponent } from '@rhino-project/core/hooks';
import { DisplayStringBase } from './DisplayString';

export const DisplayEnumBase = (props) => {
  return <DisplayStringBase {...props} />;
};

export const DisplayEnum = (props) =>
  useGlobalComponent('DisplayEnum', DisplayEnumBase, props);
