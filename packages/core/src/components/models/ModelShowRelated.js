import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import { getOwnedModels } from '../../utils/models';
import { useModelClassNames } from '../../utils/ui';
import { ModelIndexBase } from './ModelIndex';
import { useModelShowContext } from '../../hooks/controllers';

// Get models owned by this, but filter out models that match properties on the
// models, those are directly displayable (1:many would be nested)
const getRelatedModels = (model) =>
  getOwnedModels(model).filter((m) => {
    const property =
      model.properties?.[m.model] || model.properties?.[m.modelPlural];

    return (property && property?.readOnly) || !property;
  });

const defaultComponents = {
  ModelIndex: ModelIndexBase
};

export const ModelShowRelatedBase = ({ overrides, ...props }) => {
  const { ModelIndex } = useOverrides(defaultComponents, overrides);
  const { model, resource } = useModelShowContext();
  const { getRelatedModels } = props;
  const modelClassNames = useModelClassNames('show-related', model);

  const indexableModels = useMemo(
    () => getRelatedModels(model),
    [getRelatedModels, model]
  );

  return (
    <div className={modelClassNames}>
      {indexableModels.map((relatedModel) => (
        <div key={relatedModel.name}>
          <h4>{relatedModel.pluralReadableName}</h4>
          <ModelIndex
            model={relatedModel}
            parentId={resource?.id}
            defaultFilter={{ [model.model + '_id']: resource?.id }}
            syncUrl={false}
          />
        </div>
      ))}
    </div>
  );
};

ModelShowRelatedBase.propTypes = {
  getRelatedModels: PropTypes.func.isRequired,
  overrides: PropTypes.object
};

ModelShowRelatedBase.defaultProps = {
  getRelatedModels
};

export const ModelShowRelated = (props) =>
  useGlobalComponentForModel('ModelShowRelated', ModelShowRelatedBase, props);
