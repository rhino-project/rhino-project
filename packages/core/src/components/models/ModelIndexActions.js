import { Children, useCallback, useMemo, useState } from 'react';

import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelIndexContext } from 'rhino/hooks/controllers';
import { IconButton } from '../buttons';
import { useBaseOwnerNavigation } from '../../hooks/history';
import routePaths from 'rhino/routes';
import withGlobalOverrides, { useOverrides } from '../../hooks/overrides';
import withParams from '../../routes/withParams';
import { isBaseOwned } from '../../utils/models';
import ModelCreateModal from './ModelCreateModal';
import { useBaseOwnerId } from '../../hooks/owner';
import { useLocation } from 'react-router';
import { ModelCreateModalActionSaveShow } from './ModelCreateModalActions';

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
      withParams(routePaths[model.name].create(), {
        back: location.pathname,
        parentId
      }),
    [model, location.pathname, parentId]
  );

  const handleClick = useCallback(() => baseOwnerNavigation.push(createPath), [
    baseOwnerNavigation,
    createPath
  ]);

  return (
    <IconButton color="primary" icon="plus" onClick={handleClick} {...props}>
      {children || `Add ${model.readableName}`}
    </IconButton>
  );
};

export const ModelIndexActionCreateModal = ({ ...props }) => {
  const { parent } = props;
  const { model } = useModelIndexContext();
  const [modalOpen, setModalOpen] = useState(false);
  const baseOwnerId = useBaseOwnerId();

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
            ModelCreateModalActionSave: ModelCreateModalActionSaveShow
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
  prepend = false,
  ...props
}) => {
  const { ModelIndexActionCreate } = useOverrides(defaultComponents, overrides);
  const { model } = useModelIndexContext();

  const computedDefaultActions = useMemo(
    () => [<ModelIndexActionCreate />],
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
    <ModelWrapper model={model} baseClassName="Index-actions">
      <div
        className="d-flex flex-row flex-wrap justify-content-between mb-3"
        {...props}
      >
        {Children.map(computedActions, (action) => action)}
      </div>
    </ModelWrapper>
  );
};

ModelIndexActionsBase.propTypes = {};

const MODAL_CREATE_OVERRIDES = {
  ModelIndexActionCreate: ModelIndexActionCreateModal
};
export const ModelIndexActionsModalCreate = (props) => (
  <ModelIndexActionsBase overrides={MODAL_CREATE_OVERRIDES} {...props} />
);

const ModelIndexActions = withGlobalOverrides(ModelIndexActionsBase);

export default ModelIndexActions;
