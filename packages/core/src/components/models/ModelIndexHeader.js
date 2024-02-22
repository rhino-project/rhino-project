import React from 'react';
import PropTypes from 'prop-types';

import { ModelFilters } from './ModelFilters';
import { ModelPager } from './ModelPager';
import { ModelSearch } from './ModelSearch';
import { useGlobalComponentForModel, useOverrides } from '../../hooks/overrides';
import { useModelIndexContext } from '../../hooks/controllers';

const defaultComponents = {
  ModelSearch,
  ModelFilters,
  ModelPager
};

export const ModelIndexHeaderBase = ({ overrides, ...props }) => {
  const { ModelSearch, ModelFilters, ModelPager } = useOverrides(
    defaultComponents,
    overrides
  );

  const { model } = useModelIndexContext();

  return (
    <div className={`model-index-header model-index-header-${model.model}`}>
      <div className="d-flex flex-column">
        {model.searchable === true && <ModelSearch {...props} />}
        <ModelFilters {...props} />
        <div className="d-flex flex-row">
          <div className="ms-auto">
            <ModelPager {...props} />
          </div>
        </div>
      </div>
    </div>
  );
};

ModelIndexHeaderBase.propTypes = {
  overrides: PropTypes.object
};

export const ModelIndexHeader = (props) =>
  useGlobalComponentForModel('ModelIndexHeader', ModelIndexHeaderBase, props);
