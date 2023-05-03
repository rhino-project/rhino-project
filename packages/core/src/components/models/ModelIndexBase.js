import PropTypes from 'prop-types';

import ModelIndexProvider from './ModelIndexProvider';
import { useModelIndexController } from 'rhino/hooks/controllers';

const ModelIndexBase = ({ children, ...props }) => {
  const controller = useModelIndexController({
    ...props,
    queryOptions: { keepPreviousData: true }
  });

  return <ModelIndexProvider {...controller}>{children}</ModelIndexProvider>;
};

ModelIndexBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  parent: PropTypes.object,
  title: PropTypes.string
};

export default ModelIndexBase;
