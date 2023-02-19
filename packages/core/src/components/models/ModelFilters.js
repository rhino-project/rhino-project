import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { useForm } from 'react-hook-form';

import { getReferenceAttributes } from 'rhino/utils/models';
import { IconButton } from 'rhino/components/buttons';
import { usePaths } from 'rhino/hooks/paths';
import FormProvider from '../forms/FormProvider';
import { ModelFilterGroup } from './ModelFilterGroup';
import { useFilterPills } from 'rhino/hooks/form';

const ModelFilters = ({
  model,
  paths,
  searchParams,
  setSearchParams,
  resetSearchParams
}) => {
  // Use passed in paths or compute a sensible set
  const pathsOrDefault = useMemo(
    () =>
      paths ||
      getReferenceAttributes(model)
        .filter(
          (a) => a.name !== model.ownedBy && !a.name.endsWith('_attachment')
        )
        .map((a) => a.name),
    [model, paths]
  );
  const computedPaths = usePaths(pathsOrDefault);

  const methods = useForm({});
  const { control, reset, resetField, watch } = methods;
  const { pills, resetPill } = useFilterPills({ control });

  useEffect(() => {
    reset({ ...searchParams.filter, pills: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = watch((value) => {
      setSearchParams({ ...searchParams, filter: omit(value, 'pills') });
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const handleClear = (path) => {
    resetPill(path);
    resetField(path);
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    // This will trip the watchs for pill resets as well
    reset({ ...resetSearchParams()?.filter, pills: {} });
  };

  return (
    <div className="d-flex flex-column my-2">
      <div className="row">
        <FormProvider {...methods}>
          {computedPaths.map((p) => {
            return <ModelFilterGroup key={p} model={model} path={p} />;
          })}
        </FormProvider>
      </div>
      {computedPaths?.length > 0 && (
        <div className="row align-items-center m-2">
          {pills &&
            Object.keys(pills).map(
              (p) =>
                pills[p] != null && (
                  <IconButton
                    key={p}
                    icon="x"
                    color="light"
                    size="sm"
                    className="mr-2 mb-2"
                    onClick={() => handleClear(p)}
                  >
                    {pills[p]}
                  </IconButton>
                )
            )}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href="#"
            className="mb-2 col-12 col-lg-auto"
            onClick={handleClearAll}
          >
            Clear all filters
          </a>
        </div>
      )}
    </div>
  );
};

ModelFilters.propTypes = {
  model: PropTypes.object.isRequired,
  paths: PropTypes.array,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

export default ModelFilters;
