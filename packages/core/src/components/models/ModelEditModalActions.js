import PropTypes from 'prop-types';
import { ModalFooter } from 'reactstrap';

import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import {
  ModelEditActions,
  ModelEditActionCancel,
  ModelEditActionSave,
  ModelEditActionSaveShow,
  ModelEditActionsBase
} from './ModelEditActions';
import { useCallback, useMemo } from 'react';
import { ModelSection } from './ModelSection';

export const ModelEditModalActionSave = ({ onModalClose, onSave }) => {
  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      onModalClose();
    },
    [onModalClose, onSave]
  );

  return <ModelEditActionSave onSave={handleSave} />;
};

export const ModelEditModalActionSaveShow = ({ onModalClose, onSave }) => {
  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      onModalClose();
    },
    [onModalClose, onSave]
  );

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

export const ModelEditModalActionsBase = ({
  overrides,
  onModalClose,
  ...props
}) => {
  const { ModelEditModalActionSave, ModelEditModalActionCancel } = useOverrides(
    defaultComponents,
    overrides
  );

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
      <ModelSection baseClassName="edit-footer">
        <ModelEditActions
          style={{ gap: 5 }}
          overrides={computedOverrides}
          {...props}
        />
      </ModelSection>
    </ModalFooter>
  );
};

ModelEditModalActionsBase.propTypes = {
  overrides: PropTypes.object,
  onModalClose: PropTypes.func.isRequired
};

const MODAL_EDIT_SAVESHOW_OVERRIDES = {
  ModelEditActionSave: ModelEditModalActionSaveShow
};
export const ModelEditModalActionsSaveShow = (props) => (
  <ModelEditActionsBase overrides={MODAL_EDIT_SAVESHOW_OVERRIDES} {...props} />
);

export const ModelEditModalActions = (props) =>
  useGlobalComponentForModel(
    'ModelEditModalActions',
    ModelEditModalActionsBase,
    props
  );
