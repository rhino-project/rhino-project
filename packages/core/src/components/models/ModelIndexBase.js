import PropTypes from 'prop-types';

import ModelIndexProvider from './ModelIndexProvider';
import { useModelIndexController } from 'rhino/hooks/controllers';

const ModelIndexBase = ({ children, ...props }) => {
  const { filter, limit, offset, order, search, syncUrl, model } = props;

  const controller = useModelIndexController({
    model,
    filter,
    limit,
    offset,
    order,
    search,
    syncUrl,
    queryOptions: { keepPreviousData: true }
  });

  return <ModelIndexProvider {...controller}>{children}</ModelIndexProvider>;
};

ModelIndexBase.propTypes = {
  model: PropTypes.object.isRequired,
  parent: PropTypes.object,
  title: PropTypes.string
};

export default ModelIndexBase;
