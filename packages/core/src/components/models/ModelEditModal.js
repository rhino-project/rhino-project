import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { useModelEditContext } from '../../hooks/controllers';
import { useGlobalComponent, useOverrides } from '../../hooks/overrides';
import ModelEditModalActions from './ModelEditModalActions';
import ModelEditSimple from './ModelEditSimple';
import ModelSection from './ModelSection';
import ModelFieldGroup from './ModelFieldGroup';
import { useRenderPaths } from 'rhino/hooks/paths';

export const ModelEditModalHeader = (props) => {
  const { model } = useModelEditContext();
  const { title = `Edit ${model.readableName}` } = props;

  return <ModalHeader>{title}</ModalHeader>;
};

ModelEditModalHeader.propTypes = {
  title: PropTypes.string
};

export const ModelEditModalForm = ({ ...props }) => {
  const { model, paths } = useModelEditContext();
  const renderPaths = useRenderPaths(props.paths || paths, {
    Component: ModelFieldGroup,
    props: { model }
  });

  return (
    <ModelSection baseClassName="edit-form">
      <ModalBody>{renderPaths}</ModalBody>
    </ModelSection>
  );
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
        <ModelEditModalHeader title={title} />
        <ModelEditModalForm />
        <ModelEditModalActions onModalClose={onModalClose} />
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

const ModelEditModal = (props) =>
  useGlobalComponent('ModelEditModal', ModelEditModalBase, props);

export default ModelEditModal;
