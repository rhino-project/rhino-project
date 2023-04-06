import PropTypes from 'prop-types';
import { useModelEditController } from 'rhino/hooks/controllers';
import { Spinner } from 'reactstrap';
import ModelEditProvider from './ModelEditProvider';

const ModelEditBase = ({ children, spinner = true, ...props }) => {
  const controller = useModelEditController(props);
  const {
    show: { isLoading }
  } = controller;

  if (spinner && isLoading) return <Spinner />;

  return <ModelEditProvider {...controller}>{children}</ModelEditProvider>;
};

ModelEditBase.propTypes = {
  model: PropTypes.object.isRequired,
  modelId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

export default ModelEditBase;
