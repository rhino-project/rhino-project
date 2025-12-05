import PropTypes from 'prop-types';

import { ModelFiltersProvider } from '@rhino-project/core/components/models';
import { useModelFiltersController } from '@rhino-project/core/hooks';

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
