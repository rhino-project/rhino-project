import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import ModelEditBase from './ModelEditBase';
import { useModelEditContext } from '../../hooks/controllers';
import { useGlobalComponent, useOverrides } from '../../hooks/overrides';
import ModelWrapper from './ModelWrapper';
import ModelEditModalActions from './ModelEditModalActions';

export const ModelEditModalHeader = (props) => {
  const { model } = useModelEditContext();
  const { title = `Edit ${model.readableName}` } = props;

  return <ModalHeader>{title}</ModalHeader>;
};

ModelEditModalHeader.propTypes = {
  title: PropTypes.string
};

export const ModelEditModalForm = ({ overrides, onModalClose }) => {
  const { model, renderPaths } = useModelEditContext();

  return (
    <ModelWrapper model={model} baseClassName="edit-form">
      <ModalBody>{renderPaths}</ModalBody>
    </ModelWrapper>
  );
};

ModelEditModalForm.propTypes = {
  overrides: PropTypes.object
};

const defaultComponents = {
  ModelEditModalHeader,
  ModelEditModalForm,
  ModelEditModalActions
};

const ModelEditModalBase = ({
  overrides,
  isOpen,
  onModalClose,
  title,
  ...props
}) => {
  const { ModelEditModalHeader, ModelEditModalForm } = useOverrides(
    defaultComponents,
    overrides
  );

  return (
    <ModelEditBase spinner={isOpen} {...props}>
      <Modal isOpen={isOpen} autoFocus={false} toggle={onModalClose}>
        <ModelEditModalHeader title={title} />
        <ModelEditModalForm />
        <ModelEditModalActions onModalClose={onModalClose} />
      </Modal>
    </ModelEditBase>
  );
};

ModelEditModalBase.propTypes = {
  overrides: PropTypes.object,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  modelId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired
};

ModelEditModalBase.defaultProps = {
  isOpen: false
};

const ModelEditModal = (props) => useGlobalComponent(ModelEditModalBase, props);

export default ModelEditModal;
