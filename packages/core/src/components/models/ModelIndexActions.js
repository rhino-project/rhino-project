import { Children, useCallback, useMemo, useState } from 'react';

import { useLocation } from 'react-router-dom';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import { getModelCreatePath } from 'rhino/utils/routes';
import { useBaseOwnerNavigation } from '../../hooks/history';
import {
  useGlobalComponentForModel,
  useOverrides
} from '../../hooks/overrides';
import { useBaseOwnerId } from '../../hooks/owner';
import withParams from '../../routes/withParams';
import { isBaseOwned } from '../../utils/models';
import { IconButton } from '../buttons';
import ModelCreateModal from './ModelCreateModal';
import { ModelCreateModalActionSaveShow } from './ModelCreateModalActions';
import ModelSection from './ModelSection';

export const ModelIndexActionCreate = ({ children, ...props }) => {
  const { model, parentId: contextParentId } = useModelIndexContext();
  const baseOwnerNavigation = useBaseOwnerNavigation();
  const baseOwnerId = useBaseOwnerId();
  const location = useLocation();

  const parentId = useMemo(() => {
    if (contextParentId) return contextParentId;

    if (isBaseOwned(model) && baseOwnerId) return baseOwnerId;

    return null;
  }, [model, contextParentId, baseOwnerId]);

  const createPath = useMemo(
    () =>
      withParams(getModelCreatePath(model), {
        back: location.pathname,
        parentId
      }),
    [model, location.pathname, parentId]
  );

  const handleClick = useCallback(
    () => baseOwnerNavigation.push(createPath),
    [baseOwnerNavigation, createPath]
  );

  return (
    <IconButton color="primary" icon="plus" onClick={handleClick} {...props}>
      {children || `Add ${model.readableName}`}
    </IconButton>
  );
};

const defaultModelComponents = {
  ModelCreateModalActionSave: ModelCreateModalActionSaveShow
};

export const ModelIndexActionCreateModal = ({ overrides, ...props }) => {
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
      <ModelIndexActionCreate onClick={handleClick} {...props} />
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
    <ModelSection baseClassName="index-actions">
      <div className="d-flex flex-row flex-wrap justify-content-between mb-3">
        {Children.map(computedActions, (action) => action)}
      </div>
    </ModelSection>
  );
};

ModelIndexActionsBase.propTypes = {};

const MODAL_CREATE_OVERRIDES = {
  ModelIndexActionCreate: ModelIndexActionCreateModal
};
export const ModelIndexActionsModalCreate = (props) => (
  <ModelIndexActionsBase overrides={MODAL_CREATE_OVERRIDES} {...props} />
);

const ModelIndexActions = (props) =>
  useGlobalComponentForModel('ModelIndexActions', ModelIndexActionsBase, props);

export default ModelIndexActions;
