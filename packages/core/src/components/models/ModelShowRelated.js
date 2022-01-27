import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useOverrides } from 'rhino/hooks/overrides';
import { getOwnedModels } from 'rhino/utils/models';
import { useModelClassNames } from 'rhino/utils/ui';
import ModelIndex from 'rhino/components/models/ModelIndex';

// Get models owned by this, but filter out models that match properties on the
// models, those are directly displayable (1:many would be nested)
const getRelatedModels = (model) =>
  getOwnedModels(model).filter((m) => {
    const property =
      model.properties?.[m.model] || model.properties?.[m.modelPlural];

    return (property && property?.readOnly) || !property;
  });

const defaultComponents = {
  ModelIndex
};

const ModelShowRelated = ({ overrides, ...props }) => {
  const { getRelatedModels, model, resource } = props;
  const { ModelIndex } = useOverrides(defaultComponents, overrides);
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
            parent={resource}
            baseFilter={{ filter: { [model.model + '_id']: resource?.id } }}
          />
        </div>
      ))}
    </div>
  );
};

ModelShowRelated.propTypes = {
  getRelatedModels: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  resource: PropTypes.object
};

ModelShowRelated.defaultProps = {
  getRelatedModels
};

export default ModelShowRelated;
