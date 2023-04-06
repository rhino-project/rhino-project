import PropTypes from 'prop-types';
import { useModelCreateController } from 'rhino/hooks/controllers';
import ModelCreateProvider from './ModelCreateProvider';
import { Spinner } from 'reactstrap';

const ModelCreateBase = ({ children, spinner = true, ...props }) => {
  const controller = useModelCreateController(props);
  const {
    showParent: { isLoading }
  } = controller;

  if (spinner && isLoading) return <Spinner />;

  return <ModelCreateProvider {...controller}>{children}</ModelCreateProvider>;
};

ModelCreateBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  parentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

export default ModelCreateBase;
