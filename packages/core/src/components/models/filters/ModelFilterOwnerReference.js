import PropTypes from 'prop-types';

import { useBaseOwnerFilters } from '../../../hooks/owner';
import ModelFilterReference from './ModelFilterReference';

export const ModelFilterOwnerReference = (props) => {
  const { model } = props;
  const filter = useBaseOwnerFilters(model);

  return <ModelFilterReference filter={filter} {...props} />;
};

ModelFilterOwnerReference.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
