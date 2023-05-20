import { Children, cloneElement, isValidElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';

import { useModelClassNames } from 'rhino/utils/ui';
import { usePaths } from 'rhino/hooks/paths';
import { useModelShowContext } from 'rhino/hooks/controllers';
import ModelDisplayGroup from './ModelDisplayGroup';
import { useForm } from 'react-hook-form';
import FormProvider from '../forms/FormProvider';
import { useGlobalComponent } from 'rhino/hooks/overrides';

const getViewablePaths = (model) =>
  filter(model.properties, (a) => {
    return (
      a.type !== 'identifier' &&
      a.name !== model.ownedBy &&
      !(a.type === 'array' && a.readOnly) &&
      a.writeOnly !== true
    );
  }).map((a) => a.name);

export const ModelShowDescriptionBase = ({ overrides, ...props }) => {
  const { model, resource } = useModelShowContext();
  const { paths } = props;
  const modelClassNames = useModelClassNames('show-description', model);

  const methods = useForm({ values: resource });

  const pathsOrDefault = useMemo(() => paths || getViewablePaths(model), [
    paths,
    model
  ]);
  const computedPaths = usePaths(pathsOrDefault, resource);

  const renderPaths = useMemo(
    () =>
      Children.map(computedPaths, (path) =>
        isValidElement(path) ? (
          cloneElement(path, { model })
        ) : (
          <ModelDisplayGroup model={model} path={path} />
        )
      ),
    [model, computedPaths]
  );

  return (
    <div className={modelClassNames}>
      <FormProvider {...methods}>{renderPaths}</FormProvider>
    </div>
  );
};

ModelShowDescriptionBase.propTypes = {
  paths: PropTypes.array,
  overrides: PropTypes.object
};

const ModelShowDescription = (props) =>
  useGlobalComponent(ModelShowDescriptionBase, props);

export default ModelShowDescription;
