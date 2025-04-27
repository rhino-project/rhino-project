import { Children, useCallback, useMemo, useState } from 'react';

import { Link, useLocation } from '@tanstack/react-router';
import { useModelIndexContext } from '@rhino-project/core/hooks';
import {
  useGlobalComponentForModel,
  useOverrides
} from '@rhino-project/core/hooks';
import { useBaseOwnerId } from '@rhino-project/core/hooks';
import { isBaseOwned } from '@rhino-project/core/utils';
import { IconButton } from '../buttons';
import { ModelCreateModal } from './ModelCreateModal';
import { ModelCreateModalActionSaveShow } from './ModelCreateModalActions';

export const ModelIndexActionCreate = ({ children, ...props }) => {
  const { model, parentId: contextParentId } = useModelIndexContext();
  const baseOwnerId = useBaseOwnerId();
  const location = useLocation();

  const parentId = useMemo(() => {
    if (contextParentId) return contextParentId;

    if (isBaseOwned(model) && baseOwnerId) return baseOwnerId;

    return null;
  }, [model, contextParentId, baseOwnerId]);

  return (
    <IconButton
      as={Link}
      color="primary"
      icon="bi:plus"
      to={`${location.pathname}/new`}
      search={{ back: location.pathname, parentId }}
      {...props}
    >
      {children || `Add ${model.readableName}`}
    </IconButton>
  );
};

const defaultModelComponents = {
  ModelCreateModalActionSave: ModelCreateModalActionSaveShow
};

export const ModelIndexActionCreateModal = ({
  overrides,
  children,
  ...props
}) => {
  const { parent } = props;
  const { model } = useModelIndexContext();

  const [modalOpen, setModalOpen] = useState(false);
  const baseOwnerId = useBaseOwnerId();
  const { ModelCreateModalActionSave } = useOverrides(
    defaultModelComponents,
    overrides
  );

  const parentId = useMemo(() => {
    if (parent) return parent.id;

    if (isBaseOwned(model) && baseOwnerId) return baseOwnerId;

    return null;
  }, [model, parent, baseOwnerId]);

  const handleModalClose = () => setModalOpen(false);
  const handleClick = useCallback(() => setModalOpen(true), [setModalOpen]);

  return (
    <>
      <IconButton
        color="primary"
        icon="bi:plus"
        onPress={handleClick}
        {...props}
      >
        {children || `Add ${model.readableName}`}
      </IconButton>
      <ModelCreateModal
        overrides={{
          ModelCreateModalActions: {
            ModelCreateModalActionSave
          }
        }}
        model={model}
        parentId={parentId}
        isOpen={modalOpen}
        onModalClose={handleModalClose}
      />
    </>
  );
};

const defaultComponents = {
  ModelIndexActionCreate
};

export const ModelIndexActionsBase = ({
  overrides,
  actions,
  append = false,
  prepend = false
}) => {
  const { ModelIndexActionCreate } = useOverrides(defaultComponents, overrides);

  const computedDefaultActions = useMemo(
    // eslint-disable-next-line react/jsx-key
    () => [<ModelIndexActionCreate />],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const computedActions = useMemo(() => {
    if (!actions) return computedDefaultActions;

    if (append)
      return [...computedDefaultActions, ...Children.toArray(actions)];

    if (prepend)
      return [...Children.toArray(actions), ...computedDefaultActions];

    return actions;
  }, [actions, append, prepend, computedDefaultActions]);

  return (
    <div className="flex flex-row flex-wrap justify-between">
      {Children.map(computedActions, (action) => action)}
    </div>
  );
};

ModelIndexActionsBase.propTypes = {};

const MODAL_CREATE_OVERRIDES = {
  ModelIndexActionCreate: ModelIndexActionCreateModal
};
export const ModelIndexActionsModalCreate = (props) => (
  <ModelIndexActionsBase overrides={MODAL_CREATE_OVERRIDES} {...props} />
);

export const ModelIndexActions = (props) =>
  useGlobalComponentForModel('ModelIndexActions', ModelIndexActionsBase, props);
