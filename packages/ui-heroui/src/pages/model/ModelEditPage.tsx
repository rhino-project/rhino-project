import { Resources } from '@rhino-project/core';
import { ModelEdit, ModelEditProps } from '../../components/models/ModelEdit';
import { ModelPage } from './ModelPage';

export const ModelEditPage = <T extends keyof Resources>(
  props: ModelEditProps<T>
) => {
  return (
    <ModelPage>
      <ModelEdit {...props} />
    </ModelPage>
  );
};
