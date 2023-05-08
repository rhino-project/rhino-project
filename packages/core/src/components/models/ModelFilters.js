import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo
} from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { useForm } from 'react-hook-form';

import { getReferenceAttributes } from 'rhino/utils/models';
import { IconButton } from 'rhino/components/buttons';
import { usePaths } from 'rhino/hooks/paths';
import FormProvider from '../forms/FormProvider';
import ModelFilterGroup from './ModelFilterGroup';
import { useFilterPills } from 'rhino/hooks/form';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from '../../hooks/overrides';

const createFilteredObject = (obj) => {
  const result = {};
  // iterate through all keys in the object
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // if the value is not undefined, add it to the new object
      if (obj[key] !== undefined) {
        // if the value is an object, recursively call the function
        if (typeof obj[key] === 'object') {
          result[key] = createFilteredObject(obj[key]);
          // if the object is now empty, don't add it to the new object
          if (Object.keys(result[key]).length === 0) {
            delete result[key];
          }
        } else {
          result[key] = obj[key];
        }
      }
    }
  }
  return result;
};

export const ModelFiltersBase = ({ paths }) => {
  const {
    model,
    defaultState,
    filter,
    setFilter,
    setSearch
  } = useModelIndexContext();
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

  useEffect(
    () => reset({ ...filter, pills: {} }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const subscription = watch((value) => {
      // Only pass the defined values to the filter
      setFilter(createFilteredObject(omit(value, 'pills')));
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
    reset({ ...defaultState?.filter, pills: {} });
    setFilter({ ...defaultState?.filter });
    setSearch(defaultState?.search);
  };

  const renderPaths = useMemo(
    () =>
      Children.map(computedPaths, (path) =>
        isValidElement(path) ? (
          cloneElement(path, { model })
        ) : (
          <ModelFilterGroup model={model} path={path} />
        )
      ),
    [model, computedPaths]
  );

  return (
    <div className="d-flex flex-column my-2">
      <div className="row">
        <FormProvider {...methods}>{renderPaths}</FormProvider>
      </div>
      {computedPaths?.length > 0 && (
        <div className="d-flex flex-wrap align-items-center m-2">
          {pills &&
            Object.keys(pills).map(
              (p) =>
                pills[p] != null && (
                  <IconButton
                    key={p}
                    icon="x"
                    color="light"
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => handleClear(p)}
                  >
                    {pills[p]}
                  </IconButton>
                )
            )}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href="#"
            className="mb-2 col-12 col-lg-auto text-decoration-none"
            onClick={handleClearAll}
          >
            Clear all filters
          </a>
        </div>
      )}
    </div>
  );
};

ModelFiltersBase.propTypes = {
  paths: PropTypes.array
};

const ModelFilters = (props) => useGlobalComponent(ModelFiltersBase, props);

export default ModelFilters;
