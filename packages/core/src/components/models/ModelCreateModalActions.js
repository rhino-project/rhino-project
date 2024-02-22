import PropTypes from 'prop-types';
import { ModalFooter } from 'reactstrap';

import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import ModelCreateActions, {
  ModelCreateActionCancel,
  ModelCreateActionSave,
  ModelCreateActionSaveAnother,
  ModelCreateActionSaveShow
} from './ModelCreateActions';
import { useCallback, useMemo } from 'react';
import ModelSection from './ModelSection';

export const ModelCreateModalActionSave = ({ onModalClose, onSave }) => {
  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      onModalClose();
    },
    [onModalClose, onSave]
  );

  return <ModelCreateActionSave onSave={handleSave} />;
};

export const ModelCreateModalActionSaveShow = ({ onModalClose, onSave }) => {
  const handleSave = useCallback(
    (data) => {
      if (onSave) onSave(data);

      onModalClose();
    },
    [onModalClose, onSave]
  );

  return <ModelCreateActionSaveShow onSave={handleSave} />;
};

// No need to close the modal after saving another
export const ModelCreateModalActionSaveAnother = (props) => (
  <ModelCreateActionSaveAnother {...props} />
);

export const ModelCreateModalActionCancel = ({ onModalClose, onCancel }) => {
  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();

    onModalClose();
  }, [onModalClose, onCancel]);

  return <ModelCreateActionCancel onCancel={handleCancel} />;
};

const defaultComponents = {
  ModelCreateModalActionSave,
  ModelCreateModalActionCancel
};

export const ModelCreateModalActionsBase = ({
  overrides,
  onModalClose,
  ...props
}) => {
  const { ModelCreateModalActionSave, ModelCreateModalActionCancel } =
    useOverrides(defaultComponents, overrides);

  const computedOverrides = useMemo(
    () => ({
      ModelCreateActionSave: {
        component: ModelCreateModalActionSave,
        props: { onModalClose }
      },
      ModelCreateActionCancel: {
        component: ModelCreateModalActionCancel,
        props: { onModalClose }
      }
    }),
    [ModelCreateModalActionSave, ModelCreateModalActionCancel, onModalClose]
  );

  return (
    <ModalFooter>
      <ModelSection baseClassName="create-footer">
        <ModelCreateActions
          style={{ gap: 5 }}
          overrides={computedOverrides}
          {...props}
        />
      </ModelSection>
    </ModalFooter>
  );
};

ModelCreateModalActionsBase.propTypes = {
  overrides: PropTypes.object,
  onModalClose: PropTypes.func.isRequired
};

export const ModelCreateModalActionsSaveShow = (props) => (
  <ModelCreateActions
    overrides={{ ModelCreateActionSave: ModelCreateModalActionSaveShow }}
    {...props}
  />
);

export const ModelCreateModalActions = (props) =>
  useGlobalComponentForModel(
    'ModelCreateModalActions',
    ModelCreateModalActionsBase,
    props
  );
