import { ModelFilters } from './ModelFilters';
import { ModelPager } from './ModelPager';
import { ModelSearch } from './ModelSearch';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { useModelIndexContext } from '@rhino-project/core/hooks';

export const ModelIndexHeaderBase = () => {
  const { model } = useModelIndexContext();

  return (
    <>
      {model.searchable === true && <ModelSearch />}
      <ModelFilters />
      <div className="flex flex-row">
        <div className="ml-auto">
          <ModelPager />
        </div>
      </div>
    </>
  );
};

export const ModelIndexHeader = () =>
  useGlobalComponentForModel('ModelIndexHeader', ModelIndexHeaderBase, {});
