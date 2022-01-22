import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { useOverrides, useOverridesWithGlobal } from 'rhino/hooks/overrides';
import ModelEdit, {
  ModelEditActions,
  ModelEditForm
} from 'rhino/components/models/ModelEdit';

export const ModelEditModalHeader = (props) => {
  const { model, title = `Edit ${model.readableName}` } = props;

  return <ModalHeader>{title}</ModalHeader>;
};

ModelEditModalHeader.propTypes = {
  model: PropTypes.object.isRequired,
  title: PropTypes.string
};

const defaultBodyComponents = {
  ModelEditForm
};

export const ModelEditModalBody = ({ overrides, ...props }) => {
  const { ModelEditForm } = useOverrides(defaultBodyComponents, overrides);

  return (
    <ModalBody>
      <ModelEditForm {...props} />
    </ModalBody>
  );
};

ModelEditModalBody.propTypes = {
  overrides: PropTypes.object
};

const defaultFooterComponents = {
  ModelEditActions
};

export const ModelEditModalFooter = ({ overrides, ...props }) => {
  const { ModelEditActions } = useOverrides(defaultFooterComponents, overrides);

  return (
    <ModalFooter>
      <ModelEditActions {...props} />
    </ModalFooter>
  );
};

ModelEditModalFooter.propTypes = {
  overrides: PropTypes.object
};

const defaultComponents = {
  ModelEditHeader: ModelEditModalHeader,
  ModelEditForm: ModelEditModalBody,
  ModelEditActions: ModelEditModalFooter
};

const ModelEditModal = ({
  overrides,
  onActionSuccess,
  isOpen,
  onModalClose,
  ...props
}) => {
  const { model } = props;
  const {
    ModelEditHeader,
    ModelEditForm,
    ModelEditActions
  } = useOverridesWithGlobal(model, 'edit', defaultComponents, overrides);

  // We remove the normal model class div so it won't affect the modal layout
  const wrapper = useCallback(({ children }) => children, []);

  const handleActionSuccess = (action, props, data) => {
    if (onActionSuccess) onActionSuccess(action, props, data);
    onModalClose();
  };

  return (
    <Modal isOpen={isOpen} autoFocus={false} toggle={onModalClose}>
      <ModelEdit
        overrides={{
          ModelEditHeader,
          ModelEditForm,
          ModelEditActions
        }}
        {...props}
        onActionSuccess={handleActionSuccess}
        wrapper={wrapper}
      />
    </Modal>
  );
};

ModelEditModal.propTypes = {
  overrides: PropTypes.object,
  model: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired,
  onActionSuccess: PropTypes.func
};

ModelEditModal.defaultProps = {
  isOpen: false
};

export default ModelEditModal;
