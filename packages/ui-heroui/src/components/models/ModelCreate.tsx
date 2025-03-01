import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ModelCreateHeader } from './ModelCreateHeader';
import { ModelCreateForm } from './ModelCreateForm';
import { ModelCreateActions } from './ModelCreateActions';
import { ModelCreateSimple, ModelCreateSimpleProps } from './ModelCreateSimple';
import { Resources } from '@rhino-project/core';

export type ModelCreateBaseProps<T extends keyof Resources> = Omit<
  ModelCreateSimpleProps<T>,
  'children'
>;

export const ModelCreateBase = <T extends keyof Resources>(
  props: ModelCreateBaseProps<T>
) => {
  return (
    <ModelCreateSimple {...props}>
      <div className="flex flex-col gap-3">
        <ModelCreateHeader />
        <ModelCreateForm />
        <ModelCreateActions />
      </div>
    </ModelCreateSimple>
  );
};

export const ModelCreate = <T extends keyof Resources>(
  props: ModelCreateBaseProps<T>
) => useGlobalComponentForModel('ModelCreate', ModelCreateBase, props);
