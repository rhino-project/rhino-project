import { Resources } from '@rhino-project/core';
import {
  ModelIndex,
  ModelIndexProps
} from '../../components/models/ModelIndex';
import { ModelPage } from './ModelPage';

export const Index = <T extends keyof Resources>(props: ModelIndexProps<T>) => {
  return (
    <ModelPage>
      <ModelIndex {...props} />
    </ModelPage>
  );
};
