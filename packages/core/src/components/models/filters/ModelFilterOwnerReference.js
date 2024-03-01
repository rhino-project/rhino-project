import PropTypes from 'prop-types';

import { useBaseOwnerFilters } from '../../../hooks/owner';
import { ModelFilterReferenceBase } from './ModelFilterReference';
import { useGlobalComponent } from '../../../hooks';

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
