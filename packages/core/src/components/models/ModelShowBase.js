import PropTypes from 'prop-types';

import ModelShowProvider from './ModelShowProvider';
import { useModelShowController } from 'rhino/hooks/controllers';
import { Spinner } from 'reactstrap';

const ModelShowBase = ({ children, ...props }) => {
  const { model, modelId, spinner = true } = props;

  const controller = useModelShowController({
    model,
    modelId
  });
  const { isLoading } = controller;

  if (spinner && isLoading) return <Spinner />;

  return <ModelShowProvider {...controller}>{children}</ModelShowProvider>;
};

ModelShowBase.propTypes = {
  model: PropTypes.object.isRequired,
  modelId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

export default ModelShowBase;
