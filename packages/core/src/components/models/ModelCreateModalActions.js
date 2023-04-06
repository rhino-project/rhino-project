import PropTypes from 'prop-types';
import { ModalFooter } from 'reactstrap';

import { useModelCreateContext } from '../../hooks/controllers';
import withGlobalOverrides, { useOverrides } from '../../hooks/overrides';
import ModelCreateActions, {
  ModelCreateActionCancel,
  ModelCreateActionSave,
  ModelCreateActionSaveAnother,
  ModelCreateActionSaveShow
} from './ModelCreateActions';
import ModelWrapper from './ModelWrapper';
import { useCallback, useMemo } from 'react';

export const ModelCreateModalActionSave = ({ onModalClose, onSave }) => {
  const handleSave = useCallback(() => {
    if (onSave) onSave();

    onModalClose();
  }, [onModalClose, onSave]);

  return <ModelCreateActionSave onSave={handleSave} />;
};

export const ModelCreateModalActionSaveShow = ({ onModalClose, onSave }) => {
  const handleSave = useCallback(() => {
    if (onSave) onSave();

    onModalClose();
  }, [onModalClose, onSave]);

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
  const {
    ModelCreateModalActionSave,
    ModelCreateModalActionCancel
  } = useOverrides(defaultComponents, overrides);
  const { model } = useModelCreateContext();

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
      <ModelWrapper model={model} baseClassName="Create-footer">
        <ModelCreateActions
          style={{ gap: 5 }}
          overrides={computedOverrides}
          {...props}
        />
      </ModelWrapper>
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

const ModelCreateModalActions = withGlobalOverrides(
  ModelCreateModalActionsBase
);

export default ModelCreateModalActions;
