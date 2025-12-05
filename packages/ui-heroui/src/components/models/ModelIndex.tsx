import { useGlobalComponentForModel } from '@rhino-project/core/hooks';

import { ModelIndexHeader } from './ModelIndexHeader';
import { ModelIndexTable } from './ModelIndexTable';
import { ModelIndexActions } from './ModelIndexActions';
import { ModelIndexSimple, ModelIndexSimpleProp } from './ModelIndexSimple';
import { Resources } from '@rhino-project/core';

export type ModelIndexProps<T extends keyof Resources> = Omit<
  ModelIndexSimpleProp<T>,
  'children'
>;

export const ModelIndexBase = <T extends keyof Resources>(
  props: ModelIndexProps<T>
) => {
  return (
    <ModelIndexSimple {...props}>
      <div className="flex flex-col gap-3">
        <ModelIndexHeader />
        <hr />
        <ModelIndexActions />
        <ModelIndexTable />
      </div>
    </ModelIndexSimple>
  );
};

export const ModelIndex = <T extends keyof Resources>(
  props: ModelIndexProps<T>
) => useGlobalComponentForModel('ModelIndex', ModelIndexBase, props);
