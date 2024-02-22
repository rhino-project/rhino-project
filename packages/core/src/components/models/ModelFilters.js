import { IconButton } from '../buttons';
import { useModelFiltersContext, useModelFiltersController, useModelIndexContext } from '../../hooks/controllers';
import { useRenderPaths } from '../../hooks/renderPaths';
import { useGlobalComponentForModel } from '../../hooks/overrides';
import ModelFilterGroup from './ModelFilterGroup';
import ModelFiltersProvider from './ModelFiltersProvider';

export const ModelFiltersPill = ({ path }) => {
  const {
    methods: { setValue },
    pills,
    resetPill
  } = useModelFiltersContext();

  const handleClear = (path) => {
    resetPill(path);
    // Default values are always null
    setValue(path, null);
  };

  return (
    <IconButton
      icon="x"
      color="light"
      size="sm"
      className="me-2 mb-2"
      onClick={() => handleClear(path)}
    >
      {pills[path]}
    </IconButton>
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

  const handleClearAll = (e) => {
    e.preventDefault();

    reset(defaultValues);
    setFilter({});
    setPills({});
    setSearch(defaultState?.search);
  };

  if (paths?.length <= 0) return null;

  return (
    <div className="d-flex flex-wrap align-items-center m-2">
      {Object.keys(pills).map(
        (p) => pills[p] != null && <ModelFiltersPill key={p} path={p} />
      )}
      {showClearAll && (
        <a
          href="#"
          className="mb-2 col-12 col-lg-auto text-decoration-none"
          onClick={handleClearAll}
        >
          Clear all filters
        </a>
      )}
    </div>
  );
};

export const ModelFiltersForm = () => {
  const { model, paths } = useModelFiltersContext();
  const renderPaths = useRenderPaths(paths, {
    Component: ModelFilterGroup,
    props: { model }
  });

  return <>{renderPaths}</>;
};

export const ModelFiltersBase = (props) => {
  const controller = useModelFiltersController(props);

  return (
    <ModelFiltersProvider {...controller}>
      <div className="d-flex flex-column my-2">
        <div className="row">
          <ModelFiltersForm />
        </div>
        <ModelFiltersPills />
      </div>
    </ModelFiltersProvider>
  );
};

export const ModelFilters = (props) =>
  useGlobalComponentForModel('ModelFilters', ModelFiltersBase, props);
