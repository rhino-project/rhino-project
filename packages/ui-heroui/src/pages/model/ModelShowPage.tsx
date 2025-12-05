import { ModelPage } from './ModelPage';
import { ModelShow, ModelShowProps } from '../../components/models/ModelShow';
import { Resources } from '@rhino-project/core';

export const ModelShowPage = <T extends keyof Resources>(
  props: ModelShowProps<T>
) => {
  return (
    <ModelPage>
      <ModelShow {...props} />
    </ModelPage>
  );
};
