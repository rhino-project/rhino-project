import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
import { getOwnedModels } from 'rhino/utils/models';
import { useModelClassNames } from 'rhino/utils/ui';
import { ModelIndexBase } from 'rhino/components/models/ModelIndex';
import { useModelShowContext } from 'rhino/hooks/controllers';

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

  const indexableModels = useMemo(() => getRelatedModels(model), [
    getRelatedModels,
    model
  ]);

  return (
    <div className={modelClassNames}>
      {indexableModels.map((relatedModel) => (
        <div key={relatedModel.name}>
          <h4>{relatedModel.pluralReadableName}</h4>
          <ModelIndex
            model={relatedModel}
            parentId={resource?.id}
            filter={{ [model.model + '_id']: resource?.id }}
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

const ModelShowRelated = (props) =>
  useGlobalComponent('ModelShowRelated', ModelShowRelatedBase, props);

export default ModelShowRelated;
