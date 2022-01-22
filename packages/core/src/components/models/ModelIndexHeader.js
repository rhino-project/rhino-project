import React from 'react';
import PropTypes from 'prop-types';

import ModelFilters from 'rhino/components/models/ModelFilters';
import ModelPager from 'rhino/components/models/ModelPager';
import ModelSearch from 'rhino/components/models/ModelSearch';
import ModelSort from 'rhino/components/models/ModelSort';
import { useOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelSearch,
  ModelFilters,
  ModelPager,
  ModelSort
};

const ModelIndexHeader = ({ overrides, ...props }) => {
  const { model } = props;
  const { ModelSearch, ModelFilters, ModelPager, ModelSort } = useOverrides(
    defaultComponents,
    overrides
  );

  return (
    <div className={`model-index-header model-index-header-${model.model}`}>
      <div className="d-flex flex-column">
        {model.searchable === true && <ModelSearch {...props} />}
        <ModelFilters {...props} />
        <div className="d-flex flex-row flex-wrap justify-content-between">
          <div className="align-self-center">
            <ModelSort {...props} />
          </div>
          <ModelPager {...props} />
        </div>
      </div>
    </div>
  );
};

ModelIndexHeader.propTypes = {
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object
};

export default ModelIndexHeader;
