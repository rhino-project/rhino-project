import React from 'react';
import PropTypes from 'prop-types';

import ModelFilters from 'rhino/components/models/ModelFilters';
import ModelPager from 'rhino/components/models/ModelPager';
import ModelSearch from 'rhino/components/models/ModelSearch';
import ModelSort from 'rhino/components/models/ModelSort';
import {
  useGlobalComponentForModel,
  useOverrides
} from 'rhino/hooks/overrides';
import { useModelIndexContext } from 'rhino/hooks/controllers';

const defaultComponents = {
  ModelSearch,
  ModelFilters,
  ModelPager,
  ModelSort
};

export const ModelIndexHeaderBase = ({ overrides, ...props }) => {
  const { ModelSearch, ModelFilters, ModelPager, ModelSort } = useOverrides(
    defaultComponents,
    overrides
  );

  const { model } = useModelIndexContext();

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

ModelIndexHeaderBase.propTypes = {
  overrides: PropTypes.object
};

const ModelIndexHeader = (props) =>
  useGlobalComponentForModel('ModelIndexHeader', ModelIndexHeaderBase, props);

export default ModelIndexHeader;
