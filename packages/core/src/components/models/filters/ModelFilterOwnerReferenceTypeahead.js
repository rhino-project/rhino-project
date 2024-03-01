import PropTypes from 'prop-types';

import { useBaseOwnerFilters } from '../../../hooks/owner';
import { ModelFilterReferenceTypeahead } from './ModelFilterReferenceTypeahead';

export const ModelFilterOwnerReferenceTypeahead = (props) => {
  const { model } = props;
  const filter = useBaseOwnerFilters(model);

  return <ModelFilterReferenceTypeahead filter={filter} {...props} />;
};

ModelFilterOwnerReferenceTypeahead.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
