import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ModelEditHeader } from './ModelEditHeader';
import { ModelEditForm } from './ModelEditForm';
import { ModelEditActions } from './ModelEditActions';
import { ModelEditSimple, ModelEditSimpleProps } from './ModelEditSimple';
import { Resources } from '@rhino-project/core';

export type ModelEditBaseProps<T extends keyof Resources> = Omit<
  ModelEditSimpleProps<T>,
  'children'
>;

export const ModelEditBase = <T extends keyof Resources>(
  props: ModelEditSimpleProps<T>
) => {
  return (
    <ModelEditSimple {...props}>
      <div className="flex flex-col gap-3">
        <ModelEditHeader />
        <ModelEditForm />
        <ModelEditActions />
      </div>
    </ModelEditSimple>
  );
};

export const ModelEdit = <T extends keyof Resources>(
  props: ModelEditBaseProps<T>
) => useGlobalComponentForModel('ModelEdit', ModelEditBase, props);
