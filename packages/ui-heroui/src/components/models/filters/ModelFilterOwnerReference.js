import PropTypes from 'prop-types';

import {
  useBaseOwnerFilters,
  useGlobalComponent
} from '@rhino-project/core/hooks';
import { ModelFilterReferenceBase } from './ModelFilterReference';

export const ModelFilterOwnerReferenceBase = (props) => {
  const { model } = props;
  const filter = useBaseOwnerFilters(model);

  return <ModelFilterReferenceBase filter={filter} {...props} />;
};

ModelFilterOwnerReferenceBase.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export const ModelFilterOwnerReference = (props) =>
  useGlobalComponent(
    'ModelFilterOwnerReference',
    ModelFilterOwnerReferenceBase,
    props
  );
