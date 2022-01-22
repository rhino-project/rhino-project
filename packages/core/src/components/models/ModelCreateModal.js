import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { useOverrides, useOverridesWithGlobal } from 'rhino/hooks/overrides';
import ModelCreate, {
  ModelCreateActions,
  ModelCreateForm
} from 'rhino/components/models/ModelCreate';

export const ModelCreateModalHeader = (props) => {
  const { model, title = `Add ${model.readableName}` } = props;

  return <ModalHeader>{title}</ModalHeader>;
};

ModelCreateModalHeader.propTypes = {
  model: PropTypes.object.isRequired,
  title: PropTypes.string
};

const defaultBodyComponents = {
  ModelCreateForm
};

export const ModelCreateModalBody = ({ overrides, ...props }) => {
  const { ModelCreateForm } = useOverrides(defaultBodyComponents, overrides);

  return (
    <ModalBody>
      <ModelCreateForm {...props} />
    </ModalBody>
  );
};

ModelCreateModalBody.propTypes = {
  overrides: PropTypes.object
};

const defaultFooterComponents = {
  ModelCreateActions
};

export const ModelCreateModalFooter = ({ overrides, ...props }) => {
  const { ModelCreateActions } = useOverrides(
    defaultFooterComponents,
    overrides
  );

  return (
    <ModalFooter>
      <ModelCreateActions {...props} />
    </ModalFooter>
  );
};

ModelCreateModalFooter.propTypes = {
  overrides: PropTypes.object
};

const defaultComponents = {
  ModelCreateHeader: ModelCreateModalHeader,
  ModelCreateForm: ModelCreateModalBody,
  ModelCreateActions: ModelCreateModalFooter
};

const ModelCreateModal = ({
  overrides,
  onActionSuccess,
  isOpen,
  onModalClose,
  ...props
}) => {
  const { model } = props;
  const {
    ModelCreateHeader,
    ModelCreateForm,
    ModelCreateActions
  } = useOverridesWithGlobal(model, 'create', defaultComponents, overrides);

  // We remove the normal model class div so it won't affect the modal layout
  const wrapper = useCallback(({ children }) => children, []);

  const handleActionSuccess = (action, props, data) => {
    if (onActionSuccess) onActionSuccess(action, props, data);
    onModalClose();
  };

  return (
    <Modal isOpen={isOpen} autoFocus={false} toggle={onModalClose}>
      <ModelCreate
        overrides={{
          ModelCreateHeader,
          ModelCreateForm,
          ModelCreateActions
        }}
        {...props}
        onActionSuccess={handleActionSuccess}
        wrapper={wrapper}
      />
    </Modal>
  );
};

ModelCreateModal.propTypes = {
  overrides: PropTypes.object,
  model: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
  onActionSuccess: PropTypes.func
};

ModelCreateModal.defaultProps = {
  isOpen: false
};

export default ModelCreateModal;
