import PropTypes from 'prop-types';

import {
  useBaseOwnerFilters,
  useModelContext
} from '@rhino-project/core/hooks';
import { ModelFilterReferenceTypeahead } from './ModelFilterReferenceTypeahead';

export const ModelFilterOwnerReferenceTypeahead = (props) => {
  const { model } = useModelContext();
  const filter = useBaseOwnerFilters(model);

  return <ModelFilterReferenceTypeahead filter={filter} {...props} />;
};

ModelFilterOwnerReferenceTypeahead.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
