import PropTypes from 'prop-types';

import { useMemo } from 'react';
import { useBaseOwnerId } from 'rhino/hooks/owner';
import { getBaseOwnerFilters } from 'rhino/utils/models';
import ModelFilterReference from './ModelFilterReference';

const ModelFilterOwnerReference = (props) => {
  const { model } = props;

  const baseOwnerId = useBaseOwnerId();
  const filter = useMemo(() => getBaseOwnerFilters(model, baseOwnerId), [
    model,
    baseOwnerId
  ]);

  return <ModelFilterReference filter={filter} {...props} />;
};

ModelFilterOwnerReference.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterOwnerReference;
