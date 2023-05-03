import PropTypes from 'prop-types';
import { ModalFooter } from 'reactstrap';

import { useModelEditContext } from '../../hooks/controllers';
import withGlobalOverrides, { useOverrides } from '../../hooks/overrides';
import ModelEditActions, {
  ModelEditActionCancel,
  ModelEditActionSave,
  ModelEditActionSaveShow
} from './ModelEditActions';
import ModelWrapper from './ModelWrapper';
import { useCallback, useMemo } from 'react';

export const ModelEditModalActionSave = ({ onModalClose, onSave }) => {
  const handleSave = useCallback(() => {
    if (onSave) onSave();

    onModalClose();
  }, [onModalClose, onSave]);

  return <ModelEditActionSave onSave={handleSave} />;
};

export const ModelEditModalActionSaveShow = ({ onModalClose, onSave }) => {
  const handleSave = useCallback(() => {
    if (onSave) onSave();

    onModalClose();
  }, [onModalClose, onSave]);

  return <ModelEditActionSaveShow onSave={handleSave} />;
};

export const ModelEditModalActionCancel = ({ onModalClose, onCancel }) => {
  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();

    onModalClose();
  }, [onModalClose, onCancel]);

  return <ModelEditActionCancel onCancel={handleCancel} />;
};

const defaultComponents = {
  ModelEditModalActionSave,
  ModelEditModalActionCancel
};

export const ModelEditModalActionsBase = ({ overrides, onModalClose }) => {
  const { ModelEditModalActionSave, ModelEditModalActionCancel } = useOverrides(
    defaultComponents,
    overrides
  );
  const { model } = useModelEditContext();

  const computedOverrides = useMemo(
    () => ({
      ModelEditActionSave: {
        component: ModelEditModalActionSave,
        props: { onModalClose }
      },
      ModelEditActionCancel: {
        component: ModelEditModalActionCancel,
        props: { onModalClose }
      }
    }),
    [ModelEditModalActionSave, ModelEditModalActionCancel, onModalClose]
  );

  return (
    <ModalFooter>
      <ModelWrapper model={model} baseClassName="edit-footer">
        <ModelEditActions style={{ gap: 5 }} overrides={computedOverrides} />
      </ModelWrapper>
    </ModalFooter>
  );
};

ModelEditModalActionsBase.propTypes = {
  overrides: PropTypes.object,
  onModalClose: PropTypes.func.isRequired
};

export const ModelEditModalActionsSaveShow = (props) => (
  <ModelEditActions
    overrides={{ ModelEditActionSave: ModelEditModalActionSaveShow }}
    {...props}
  />
);

const ModelEditModalActions = withGlobalOverrides(ModelEditModalActionsBase);

export default ModelEditModalActions;
