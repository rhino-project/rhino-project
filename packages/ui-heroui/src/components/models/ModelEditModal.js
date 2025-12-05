import PropTypes from 'prop-types';

import { useRenderPaths } from '../../hooks/renderPaths';
import { useModelEditContext } from '@rhino-project/core/hooks';
import {
  useGlobalComponentForModel,
  useOverrides
} from '@rhino-project/core/hooks';
import { ModelEditModalActions } from './ModelEditModalActions';
import { ModelEditSimple } from './ModelEditSimple';
import { ModelFieldGroup } from './ModelFieldGroup';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';

export const ModelEditModalHeader = (props) => {
  const { model } = useModelEditContext();
  const { title = `Edit ${model.readableName}` } = props;

  return <ModalHeader>{title}</ModalHeader>;
};

ModelEditModalHeader.propTypes = {
  title: PropTypes.string
};

export const ModelEditModalForm = ({ ...props }) => {
  const { paths } = useModelEditContext();
  const renderPaths = useRenderPaths(props.paths || paths, {
    Component: ModelFieldGroup
  });

  return <ModalBody>{renderPaths}</ModalBody>;
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
    <Modal isOpen={isOpen} autoFocus={false} toggle={onModalClose}>
      <ModelEditSimple fallback={isOpen} {...props}>
        <ModalContent>
          <ModelEditModalHeader title={title} />
          <ModelEditModalForm />
          <ModelEditModalActions onModalClose={onModalClose} />
        </ModalContent>
      </ModelEditSimple>
    </Modal>
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

export const ModelEditModal = (props) =>
  useGlobalComponentForModel('ModelEditModal', ModelEditModalBase, props);
