import PropTypes from 'prop-types';

import {
  useGlobalComponentForModel,
  useOverrides
} from '@rhino-project/core/hooks';

import { ModelIndexHeader } from './ModelIndexHeader';
import { ModelIndexTable } from './ModelIndexTable';
import { ModelIndexActions } from './ModelIndexActions';
import { ModelIndexSimple } from './ModelIndexSimple';

const defaultComponents = {
  ModelIndexHeader,
  ModelIndexActions,
  ModelIndexTable
};

export const ModelIndexBase = ({ overrides, ...props }) => {
  const { ModelIndexHeader, ModelIndexActions, ModelIndexTable } = useOverrides(
    defaultComponents,
    overrides,
    props
  );

  return (
    <ModelIndexSimple {...props}>
      {/* FIXME: Stop passing down props */}
      <div className="my-3">
        <ModelIndexHeader {...props} />
      </div>
      <hr />
      <div className="my-3">
        <ModelIndexActions {...props} />
      </div>
      <ModelIndexTable {...props} />
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
