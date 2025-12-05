import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ModelShowDescription } from './ModelShowDescription';
import { ModelShowRelated } from './ModelShowRelated';
import { ModelShowActions } from './ModelShowActions';
import { ModelShowSimple, ModelShowSimpleProps } from './ModelShowSimple';
import { ModelShowHeader } from './ModelShowHeader';
import { Resources } from '@rhino-project/core';

export type ModelShowProps<T extends keyof Resources> = Omit<
  ModelShowSimpleProps<T>,
  'children'
>;

export const ModelShowBase = <T extends keyof Resources>(
  props: ModelShowProps<T>
) => {
  return (
    <ModelShowSimple {...props}>
      <div className="flex flex-col gap-3">
        <ModelShowHeader />
        <ModelShowActions />
        <ModelShowDescription />
        <ModelShowRelated />
      </div>
    </ModelShowSimple>
  );
};

export const ModelShow = <T extends keyof Resources>(
  props: ModelShowProps<T>
) => useGlobalComponentForModel('ModelShow', ModelShowBase, props);
