import PropTypes from 'prop-types';

import { ModelFiltersProvider } from './ModelFiltersProvider';
import { useModelFiltersController } from '../../hooks/controllers';

export const ModelFiltersSimple = ({ children, ...props }) => {
  const controller = useModelFiltersController(props);

  return (
    <ModelFiltersProvider {...controller}>{children}</ModelFiltersProvider>
  );
};

ModelFiltersSimple.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};
