import { Resources } from '@rhino-project/core';
import {
  ModelCreate,
  ModelCreateProps
} from '../../components/models/ModelCreate';
import { ModelPage } from './ModelPage';

export const ModelCreatePage = <T extends keyof Resources>(
  props: ModelCreateProps<T>
) => {
  return (
    <ModelPage>
      <ModelCreate {...props} />
    </ModelPage>
  );
};
