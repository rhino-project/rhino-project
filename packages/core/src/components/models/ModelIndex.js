import PropTypes from 'prop-types';

import { useGlobalComponentForModel, useOverrides } from '../../hooks/overrides';

import ModelIndexHeader from './ModelIndexHeader';
import ModelIndexTable from './ModelIndexTable';
import ModelIndexActions from './ModelIndexActions';
import ModelIndexSimple from './ModelIndexSimple';
import ModelSection from './ModelSection';

const defaultComponents = {
  ModelIndexHeader,
  ModelIndexActions,
  ModelIndexTable
};

export const ModelIndexBase = ({ overrides, baseFilter, ...props }) => {
  const { ModelIndexHeader, ModelIndexActions, ModelIndexTable } = useOverrides(
    defaultComponents,
    overrides,
    props
  );

  if (baseFilter)
    console.warn(
      'baseFilter is deprecated. Use filter/limit/offset/order/search instead'
    );

  // Legacy baseFilter support - must be after the new props to avoid being overwritten by undefined
  return (
    <ModelIndexSimple {...props} {...baseFilter}>
      <ModelSection baseClassName="index">
        {/* FIXME: Stop passing down props */}
        <ModelIndexHeader {...props} />
        <hr />
        <ModelIndexActions {...props} />
        <ModelIndexTable {...props} />
      </ModelSection>
    </ModelIndexSimple>
  );
};

ModelIndexBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  baseFilter: PropTypes.object,
  overrides: PropTypes.object,
  parent: PropTypes.object
};

export const ModelIndex = (props) =>
  useGlobalComponentForModel('ModelIndex', ModelIndexBase, props);
