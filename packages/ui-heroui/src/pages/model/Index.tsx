import { RhinoResourceSpecifier } from '@rhino-project/core';
import { ModelIndex } from '../../components/models/ModelIndex';
import { ModelPage } from './ModelPage';

export type ModelIndexPageProps = {
  model: RhinoResourceSpecifier;
};

export const Index = (props: ModelIndexPageProps) => {
  return (
    <ModelPage>
      <ModelIndex {...props} />
    </ModelPage>
  );
};
