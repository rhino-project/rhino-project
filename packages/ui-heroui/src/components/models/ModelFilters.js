import {
  useModelFiltersContext,
  useModelFiltersController,
  useModelIndexContext
} from '@rhino-project/core/hooks';
import { useRenderPaths } from '../../hooks/renderPaths';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';
import { ModelFiltersProvider } from '@rhino-project/core/components/models';
import { ModelFilter } from './ModelFilter';
import { Chip, Link } from '@heroui/react';
import { useCallback } from 'react';

export const ModelFiltersPill = ({ path }) => {
  const {
    methods: { setValue },
    pills,
    resetPill
  } = useModelFiltersContext();

  const handleClose = useCallback(() => {
    resetPill(path);
    // Default values are always null
    setValue(path, null);
  }, [path, resetPill, setValue]);

  return (
    <Chip className="cursor-pointer" onClose={handleClose}>
      {pills[path]}
    </Chip>
  );
};

export const ModelFiltersPills = ({ showClearAll = true }) => {
  const {
    defaultValues,
    methods: { reset },
    paths,
    pills,
    setPills
  } = useModelFiltersContext();
  const { defaultState, setFilter, setSearch } = useModelIndexContext();

  const handleClearAll = () => {
    reset(defaultValues);
    setFilter({});
    setPills({});
    setSearch(defaultState?.search);
  };

  if (paths?.length <= 0) return null;

  return (
    <div className="flex flex-row flex-wrap items-center gap-2 m-2">
      {Object.keys(pills).map(
        (p) => pills[p] != null && <ModelFiltersPill key={p} path={p} />
      )}
      {showClearAll && (
        <Link className="cursor-pointer" onPress={handleClearAll}>
          Clear all filters
        </Link>
      )}
    </div>
  );
};

export const ModelFiltersForm = () => {
  const { paths } = useModelFiltersContext();
  const renderPaths = useRenderPaths(paths, {
    Component: ModelFilter
  });

  return <>{renderPaths}</>;
};

export const ModelFiltersBase = (props) => {
  const controller = useModelFiltersController(props);

  return (
    <ModelFiltersProvider {...controller}>
      <div className="grid grid-cols-3 gap-2 my-2">
        <ModelFiltersForm />
      </div>
      <ModelFiltersPills />
    </ModelFiltersProvider>
  );
};

export const ModelFilters = (props) =>
  useGlobalComponentForModel('ModelFilters', ModelFiltersBase, props);
