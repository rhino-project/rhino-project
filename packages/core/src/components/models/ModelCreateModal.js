import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { useModelCreateContext } from '../../hooks/controllers';
import { useGlobalComponent, useOverrides } from '../../hooks/overrides';
import ModelCreateModalActions from './ModelCreateModalActions';
import ModelSection from './ModelSection';
import ModelCreateSimple from './ModelCreateSimple';

export const ModelCreateModalHeader = (props) => {
  const { model } = useModelCreateContext();
  const { title = `Add ${model.readableName}` } = props;

  return <ModalHeader>{title}</ModalHeader>;
};

ModelCreateModalHeader.propTypes = {
  title: PropTypes.string
};

export const ModelCreateModalForm = ({ overrides, onModalClose }) => {
  const { renderPaths } = useModelCreateContext();

  return (
    <ModelSection baseClassName="edit-form">
      <ModalBody>{renderPaths}</ModalBody>
    </ModelSection>
  );
};

ModelCreateModalForm.propTypes = {
  overrides: PropTypes.object
};

const defaultComponents = {
  ModelCreateModalHeader,
  ModelCreateModalForm,
  ModelCreateModalActions
};

export const ModelCreateModalBase = ({
  overrides,
  isOpen,
  onModalClose,
  title,
  ...props
}) => {
  const {
    ModelCreateModalHeader,
    ModelCreateModalForm,
    ModelCreateModalActions
  } = useOverrides(defaultComponents, overrides);

  return (
    <ModelCreateSimple fallback={isOpen} {...props}>
      <Modal isOpen={isOpen} autoFocus={false} toggle={onModalClose}>
        <ModelCreateModalHeader title={title} />
        <ModelCreateModalForm />
        <ModelCreateModalActions onModalClose={onModalClose} />
      </Modal>
    </ModelCreateSimple>
  );
};

ModelCreateModalBase.propTypes = {
  overrides: PropTypes.object,
  model: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired
};

ModelCreateModalBase.defaultProps = {
  isOpen: false
};

const ModelCreateModal = (props) =>
  useGlobalComponent('ModelCreateModal', ModelCreateModalBase, props);

export default ModelCreateModal;
