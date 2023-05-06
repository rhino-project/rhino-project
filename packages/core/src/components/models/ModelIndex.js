import PropTypes from 'prop-types';

import { useGlobalComponent, useGlobalOverrides } from 'rhino/hooks/overrides';

import ModelIndexHeader from 'rhino/components/models/ModelIndexHeader';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { ModelIndexTableBase } from './ModelIndexTable';
import ModelIndexActions from './ModelIndexActions';
import ModelIndexSimple from './ModelIndexSimple';

const defaultComponents = {
  ModelIndexHeader,
  ModelIndexActions,
  ModelIndexTable: ModelIndexTableBase
};

export const ModelIndexBase = ({
  overrides,
  baseFilter,
  wrapper,
  ...props
}) => {
  const {
    ModelIndexHeader,
    ModelIndexActions,
    ModelIndexTable
  } = useGlobalOverrides(defaultComponents, overrides, props);
  const { model } = props;

  if (baseFilter)
    console.warn(
      'baseFilter is deprecated. Use filter/limit/offset/order/search instead'
    );

  // Legacy baseFilter support - must be after the new props to avoid being overwritten by undefined
  return (
    <ModelIndexSimple {...props} {...baseFilter}>
      <ModelWrapper model={model} wrapper={wrapper} baseClassName="index">
        {/* FIXME: Stop passing down props */}
        <ModelIndexHeader {...props} />
        <hr />
        <ModelIndexActions {...props} />
        <ModelIndexTable {...props} />
      </ModelWrapper>
    </ModelIndexSimple>
  );
};

ModelIndexBase.propTypes = {
  baseFilter: PropTypes.object,
  model: PropTypes.object.isRequired,
  overrides: PropTypes.object,
  parent: PropTypes.object
};

const ModelIndex = (props) => useGlobalComponent(ModelIndexBase, props);

export default ModelIndex;
