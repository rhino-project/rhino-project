import PropTypes from 'prop-types';

import { useGlobalOverrides } from 'rhino/hooks/overrides';

import ModelIndexHeader from 'rhino/components/models/ModelIndexHeader';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import ModelIndexBase from './ModelIndexBase';
import { ModelIndexTableBase } from './ModelIndexTable';
import ModelIndexActions from './ModelIndexActions';

const defaultComponents = {
  ModelIndex: ModelIndexBase,
  ModelIndexHeader,
  ModelIndexActions,
  ModelIndexTable: ModelIndexTableBase
};

const ModelIndex = ({ overrides, baseFilter, ...props }) => {
  if (baseFilter)
    console.warn(
      'baseFilter is deprecated. Use filter/limit/offset/order/search instead'
    );

  const {
    ModelIndex,
    ModelIndexHeader,
    ModelIndexActions,
    ModelIndexTable
  } = useGlobalOverrides(defaultComponents, overrides, props);

  return (
    <ModelWrapper {...props} baseClassName="index">
      {/* Legacy support - must be after the new props to avoid being overwritten by
      undefined */}
      <ModelIndex {...props} {...baseFilter}>
        {/* FIXME: Stop passing down props */}
        <ModelIndexHeader {...props} />
        <hr />
        <ModelIndexActions {...props} />
        <ModelIndexTable {...props} />
      </ModelIndex>
    </ModelWrapper>
  );
};

ModelIndex.propTypes = {
  baseFilter: PropTypes.object,
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  parent: PropTypes.object
};

export default ModelIndex;
