import PropTypes from 'prop-types';

import { ModelFilters } from './ModelFilters';
import { ModelPager } from './ModelPager';
import { ModelSearch } from './ModelSearch';
import {
  useGlobalComponentForModel,
  useOverrides
} from '@rhino-project/core/hooks';
import { useModelIndexContext } from '@rhino-project/core/hooks';

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
    <>
      {model.searchable === true && <ModelSearch {...props} />}
      <ModelFilters {...props} />
      <div className="flex flex-row">
        <div className="ml-auto">
          <ModelPager {...props} />
        </div>
      </div>
    </>
  );
};

ModelIndexHeaderBase.propTypes = {
  overrides: PropTypes.object
};

export const ModelIndexHeader = (props) =>
  useGlobalComponentForModel('ModelIndexHeader', ModelIndexHeaderBase, props);
